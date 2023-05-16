import { Circle, Point, Vector } from "../common/data-types/shapes.ts";
import { CommandAction, PlayerRole, TeamName } from "../common/data-types/types-base.ts";
import { ClientMessageTypes, ClientMessageWithId, MoveMessagePayload } from "../common/message-types/types-client.ts";
import { ServerMessageTypes } from "../common/message-types/types-server.ts";
import { gameEngine } from "../common/settings.ts";
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
			id: id,
			teamBoard: state[team].teamBoard
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
		// Nothing yet
	} else if (player.commandOption == CommandAction.COMPLETE_ORDERS) {
		// Nothing yet
	} else if (player.commandOption == CommandAction.GATHER_INTEL) {
		// Nothing yet
	} else if (player.commandOption == CommandAction.REPORT_INTEL) {
		// Nothing yet
	}
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
}
