import { Circle, Point, Vector } from "../common/data-types/shapes.ts";
import { BriefingName, ChesswarId, PlayerAction, PlayerRole, TeamName } from "../common/data-types/base.ts";
import map from "../common/map.ts";
import { ClientMessageTypes, ClientMessageWithId, GeneralOrdersMessagePayload, MoveMessagePayload } from "../common/message-types/client.ts";
import { ServerMessageTypes } from "../common/message-types/server.ts";
import { gameEngine } from "../common/settings.ts";
import { inside } from "../common/shape-logic/inside.ts";
import { makeMove } from "./chess.ts";
import socket from "./socket.ts";
import { setCarrying, spawnPlayer } from "./spawn.ts";
import state, { ServerPlayer } from "./state.ts";
import { CarryLoad, CarryLoadType } from "../common/data-types/server.ts";

export function addPlayer(id: string): void {
	const team = newPlayerTeam();
	const newPlayer: ServerPlayer = {
		id,
		team,
		role: PlayerRole.SOLDIER,
		actionOption: null,
		carrying: {
			type: CarryLoadType.EMPTY,
			load: null
		},
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
		},
		deathCounter: 0
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
	try {
		const player = getPlayer(id);
		state.allPlayers.delete(id);
		state[player.team].playerMap.delete(id);
	} catch (err) {
		console.error(err);
	}
}

export function receiveMessage(message: ClientMessageWithId): void {
	const player = getPlayer(message.id);

	if (message.type == ClientMessageTypes.MOVE) {
		playerMove(player, message.payload);
	} else if (message.type == ClientMessageTypes.ACTION) {
		playerAction(player);
	} else if (message.type == ClientMessageTypes.GENERAL_ORDERS) {
		generalOrders(player, message.payload);
	} else if (message.type == ClientMessageTypes.PING) {
		pong(message.id);
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

function playerAction(player: ServerPlayer): void {
	if (player.actionOption == null) {
		// Do nothing
	} else if (player.actionOption == PlayerAction.BECOME_GENERAL) {
		becomeRole(player, PlayerRole.GENERAL);
	} else if (player.actionOption == PlayerAction.BECOME_SOLDIER) {
		becomeRole(player, PlayerRole.SOLDIER);
	} else if (player.actionOption == PlayerAction.BECOME_TANK) {
		becomeRole(player, PlayerRole.TANK);
	} else if (player.actionOption == PlayerAction.BECOME_OPERATIVE) {
		becomeRole(player, PlayerRole.OPERATIVE);
	} else if (player.actionOption == PlayerAction.GRAB_ORDERS) {
		const briefing = whichBriefing(player);
		if (briefing == null) {
			throw new Error("Couldn't find the briefing");
		} else {
			const briefingMove = state[player.team].briefings[briefing];
			let carryLoad: CarryLoad;
			if (briefingMove == null) {
				carryLoad = {
					type: CarryLoadType.EMPTY,
					load: null
				};
			} else {
				carryLoad = {
					type: CarryLoadType.ORDERS,
					load: briefingMove
				};
			}

			setCarrying(player, carryLoad);
		}
	} else if (player.actionOption == PlayerAction.COMPLETE_ORDERS) {
		if (player.carrying.type == CarryLoadType.ORDERS) {
			makeMove(state.realBoard, player.carrying.load);
			setCarrying(player, null);
		}
	} else if (player.actionOption == PlayerAction.GATHER_INTEL) {
		const load = {
			type: CarryLoadType.INTEL,
			load: structuredClone(state.realBoard)
		};
		setCarrying(player, load);
	} else if (player.actionOption == PlayerAction.REPORT_INTEL) {
		if (player.carrying.type == CarryLoadType.INTEL) {
			state[player.team].teamBoard = player.carrying.load;
			setCarrying(player, null);
		}
	} else if (player.actionOption == PlayerAction.CONDUCT_ESPIONAGE) {
		const oppositeTeam = player.team == TeamName.ALPHA ? TeamName.BRAVO : TeamName.ALPHA;
		const load = {
			type: CarryLoadType.ESPIONAGE,
			load: structuredClone(state[oppositeTeam].briefings)
		};
		setCarrying(player, load);
	} else if (player.actionOption == PlayerAction.REPORT_ESPIONAGE) {
		if (player.carrying.type == CarryLoadType.ESPIONAGE) {
			state[player.team].enemyBriefings = player.carrying.load;
			setCarrying(player, null);
		}
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

	setCarrying(player, null);
}

function generalOrders(player: ServerPlayer, payload: GeneralOrdersMessagePayload) {
	if (player.role != PlayerRole.GENERAL) {
		return;
	} else if (player.team != payload.move.team) {
		// Make sure they don't try to be cheatin
		return;
	}

	const {briefing, move} = payload;
	state[player.team].briefings[briefing] = move;
}

function pong(playerId: ChesswarId) {
	socket.sendOne(playerId, {
		type: ServerMessageTypes.PONG,
		payload: null
	});
}
