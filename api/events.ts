import { Circle, Point, Vector } from "../common/data-types/shapes.ts";
import { PlayerType, TeamName } from "../common/data-types/types-base.ts";
import { ClientMessageTypes, ClientMessageWithId, MoveMessagePayload } from "../common/message-types/types-client.ts";
import { ServerMessageTypes } from "../common/message-types/types-server.ts";
import { gameEngine } from "../common/settings.ts";
import { pointToVector } from "../common/shape-logic/vector.ts";
import socket from "./socket.ts";
import { spawnPlayer } from "./spawn.ts";
import state, { ServerPlayer } from "./state.ts";

export function addPlayer(id: string): void {
	const team = newPlayerTeam();
	const newPlayer: ServerPlayer = {
		id,
		team,
		role: PlayerType.SOLDIER,
		canSwitchTo: null,
		physics: {
			inputForce: Vector(0, 0),
			speed: Vector(0, 0),
			mass: 0,
			position: Circle(Point(0, 0), 0)
		}
	}

	spawnPlayer(newPlayer);

	state.allPlayers.set(id, newPlayer);
	state[team].playerMap.set(id, newPlayer);

	socket.send(id, {
		type: ServerMessageTypes.PLAYER_INIT,
		payload: {
			id
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
	} else if (message.type == ClientMessageTypes.SWITCH) {
		playerSwitch(player);
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
	// Compute force
	const pos = gameEngine.inputForceMag;
	const neg = -1*pos;

	const left = keys.left ? neg : 0;
	const right = keys.right ? pos : 0;
	const up = keys.up ? neg : 0;
	const down = keys.down ? pos : 0;

	const xDir = left + right;
	const yDir = up + down;

	const force = pointToVector(Point(xDir, yDir));

	player.physics.inputForce = force;
}

function playerSwitch(player: ServerPlayer) {
	if (player.canSwitchTo == null) {
		// Do nothing
	} else if (player.canSwitchTo == player.role) {
		// Do nothing
	} else {
		player.role = player.canSwitchTo;
		const radius = gameEngine.physics[player.role].radius;
		player.physics.position = Circle(player.physics.position.center, radius);
	}
}
