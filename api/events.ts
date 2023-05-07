import { Point, Vector } from "../common/data-types/structures.ts";
import map from "../common/map.ts";
import { ClientMessageTypes, ClientMessageWithId, KeysMessagePayload } from "../common/message-types/types-client.ts";
import { ServerMessageTypes } from "../common/message-types/types-server.ts";
import { gameEngine } from "../common/settings.ts";
import socket from "./socket.ts";
import state, { ServerPlayer } from "./state.ts";

export function addPlayer(id: string): void {
	state.playerMap.set(id, {
		id,
		acceleration: Vector(0, 0),
		speed: Vector(0, 0),
		position: Point(map.start.x, map.start.y)
	});

	socket.send(id, {
		type: ServerMessageTypes.PLAYER_INIT,
		payload: {
			id
		}
	});
}

export function removePlayer(id: string): void {
	state.playerMap.delete(id);
}

function getPlayer(id: string): ServerPlayer {
	const player = state.playerMap.get(id);
	if (player) {
		return player;
	} else {
		throw new ReferenceError("Could not find player: " + id);
	}
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

	getPlayer(id).acceleration = acceleration;
}