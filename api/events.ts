import { deepCopy } from "../common/copy.ts";
import { Circle, Point, Vector } from "../common/data-types/shapes.ts";
import { BriefingName, ChessBoard, ChessMove, CommandAction, PlayerRole, TeamName } from "../common/data-types/types-base.ts";
import map from "../common/map.ts";
import { ClientMessageTypes, ClientMessageWithId, GeneralOrdersMessagePayload, MoveMessagePayload } from "../common/message-types/types-client.ts";
import { ServerMessageTypes } from "../common/message-types/types-server.ts";
import { gameEngine } from "../common/settings.ts";
import { inside } from "../common/shape-logic/inside.ts";
import socket from "./socket.ts";
import { spawnPlayer } from "./spawn.ts";
import state, { ServerPlayer } from "./state.ts";

export function addPlayer(id: string): void {
	const team = newPlayerTeam();
	const newPlayer: ServerPlayer = {
		id,
		team,
		role: PlayerRole.SOLDIER,
		commandOption: null,
		carrying: null,
		movement: {
			left: false,
			right: false,
			up: false,
			down: false
		},
		physics: {
			speed: Vector(0, 0),
			mass: 0,
			position: Circle(Point(0, 0), 0)
		}
	}

	spawnPlayer(newPlayer);

	state.allPlayers.set(id, newPlayer);
	state[team].playerMap.set(id, newPlayer);

	socket.sendOne(id, {
		type: ServerMessageTypes.PLAYER_INIT,
		payload: {
			id: id
		}
	});
}

// Add them to the team with fewer players
function newPlayerTeam(): TeamName {
	if (state[TeamName.ALPHA].playerMap.size > state[TeamName.BRAVO].playerMap.size) {
		return TeamName.BRAVO;
	} else {
		return TeamName.ALPHA;
	}
}

export function removePlayer(id: string): void {
	const player = getPlayer(id);

	state.allPlayers.delete(id);
	state[player.team].playerMap.delete(id);
}

export function receiveMessage(message: ClientMessageWithId): void {
	const player = getPlayer(message.id);

	if (message.type == ClientMessageTypes.MOVE) {
		playerMove(player, message.payload);
	} else if (message.type == ClientMessageTypes.COMMAND) {
		playerCommand(player);
	} else if (message.type == ClientMessageTypes.GENERAL_ORDERS) {
		generalOrders(player, message.payload);
	}
}

function getPlayer(id: string): ServerPlayer {
	const player = state.allPlayers.get(id);
	if (player) {
		return player;
	} else {
		throw new ReferenceError("Could not find player: " + id);
	}
}

function playerMove(player: ServerPlayer, keys: MoveMessagePayload): void {
	player.movement = keys;
}

function playerCommand(player: ServerPlayer): void {
	if (player.commandOption == null) {
		// Do nothing
	} else if (player.commandOption == CommandAction.BECOME_GENERAL) {
		becomeRole(player, PlayerRole.GENERAL);
	} else if (player.commandOption == CommandAction.BECOME_SOLDIER) {
		becomeRole(player, PlayerRole.SOLDIER);
	} else if (player.commandOption == CommandAction.BECOME_TANK) {
		becomeRole(player, PlayerRole.TANK);
	} else if (player.commandOption == CommandAction.BECOME_SPY) {
		becomeRole(player, PlayerRole.SPY);
	} else if (player.commandOption == CommandAction.GRAB_ORDERS) {
		const briefing = whichBriefing(player);
		if (briefing == null) {
			throw new Error("Couldn't find the briefing");
		} else {
			const move = state[player.team].briefings[briefing] as ChessMove;
			player.carrying = deepCopy(move);
		}
	} else if (player.commandOption == CommandAction.COMPLETE_ORDERS) {
		if (player.carrying != null) {
			// do command
		}
	} else if (player.commandOption == CommandAction.GATHER_INTEL) {
		player.carrying = deepCopy(state.realBoard);
	} else if (player.commandOption == CommandAction.REPORT_INTEL) {
		state[player.team].teamBoard = player.carrying as ChessBoard;
	}
}

function whichBriefing(player: ServerPlayer): null | BriefingName {
	const pos = player.physics.position;
	const facilityBundles = map.facilities.filter(fac => fac.team == player.team);

	for (const bundle of facilityBundles) {
		if (inside(pos, bundle.briefings[0])) {
			return BriefingName.ONE;
		} else if (inside(pos, bundle.briefings[1])) {
			return BriefingName.TWO;
		} else if (inside(pos, bundle.briefings[2])) {
			return BriefingName.THREE;
		}
	}

	return null;
}

function becomeRole(player: ServerPlayer, role: PlayerRole): void {
	player.role = role;
	const radius = gameEngine.physics[role].radius;
	const mass = gameEngine.physics[role].mass;

	player.physics.mass = mass;
	player.physics.position = Circle(player.physics.position.center, radius);

	if (role == PlayerRole.GENERAL) {
		player.physics.speed = Vector(0, 0);
	}

	player.carrying = null;
}

function generalOrders(player: ServerPlayer, payload: GeneralOrdersMessagePayload) {
	if (player.role != PlayerRole.GENERAL) {
		return;
	}

	const {briefing, move} = payload;
	state[player.team].briefings[briefing] = move;
}
