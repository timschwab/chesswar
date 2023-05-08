import { Vector } from "../common/data-types/shapes.ts";
import { PlayerType, TeamName } from "../common/data-types/types-base.ts";
import { ClientMessageTypes, ClientMessageWithId, KeysMessagePayload } from "../common/message-types/types-client.ts";
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
		role: PlayerType.SOLDIER,
		canSwitchTo: null,
		physics: spawnPlayer(team)
	}

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
	if (message.type == ClientMessageTypes.KEYS) {
		keysUpdate(message.id, message.payload);
	}
}

function keysUpdate(id: string, keys: KeysMessagePayload): void {
	const pos = gameEngine.acceleration;
	const neg = -1 * pos;

	// Compute acceleration
	const left = keys.left ? neg : 0;
	const right = keys.right ? pos : 0;
	const up = keys.up ? neg : 0;
	const down = keys.down ? pos : 0;

	const acceleration = Vector(left + right, up + down);

	getPlayer(id).physics.acceleration = acceleration;
}

function getPlayer(id: string): ServerPlayer {
	const player = state.allPlayers.get(id);
	if (player) {
		return player;
	} else {
		throw new ReferenceError("Could not find player: " + id);
	}
}
