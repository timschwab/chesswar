import socket from "./socket.ts";
import map from "../common/map.ts";
import { ClientMessageTypes, ClientMessageWithId, KeysMessagePayload } from "../common/message-types/types-client.ts";
import { ServerMessageTypes } from "../common/message-types/types-server.ts";
import { ClientPlayer } from "../common/data-types/types-client.ts";
import { Point, Vector } from "../common/data-types/structures.ts";
import { gameEngine } from "../common/settings.ts";

interface ServerPlayer {
	id: string,
	acceleration: Vector,
	speed: Vector,
	position: Point
}

const state = {
	players: new Map<string, ServerPlayer>()
};

function init() {
	socket.listen.add(addPlayer);
	socket.listen.remove(removePlayer);
	socket.listen.message(receiveMessage);

	setInterval(tick, 50);
}

function addPlayer(id: string): void {
	state.players.set(id, {
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

function removePlayer(id: string): void {
	state.players.delete(id);
}

function getPlayer(id: string): ServerPlayer {
	const player = state.players.get(id);
	if (player) {
		return player;
	} else {
		throw new ReferenceError("Could not find player: " + id);
	}
}

function receiveMessage(message: ClientMessageWithId): void {
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

function tick(): void {
	// Tick everything
	tickPlayers();
	// Other stuff eventually

	// Broadcast to everyone
	const playerList = Array.from(state.players.values());
	const payload = playerList.map(serverPlayerToClientPlayer);

	socket.broadcast({
		type: ServerMessageTypes.STATE,
		payload: payload
	});
}

function tickPlayers() {
	const posSpeed = gameEngine.maxSpeed;
	const negSpeed = -1 * posSpeed;

	for (const player of state.players.values()) {
		// Compute speed based on acceleration
		let speedX = player.speed.x
		speedX += player.acceleration.x;
		speedX = between(speedX, negSpeed, posSpeed);

		let speedY = player.speed.y
		speedY += player.acceleration.y;
		speedY = between(speedY, negSpeed, posSpeed);

		// Compute position based on speed, and bounce off the sides
		let positionX = player.position.x;
		positionX += player.speed.x;
		positionX = between(positionX, 0, map.width, function () {
			speedX *= -1;
		});

		let positionY = player.position.y;
		positionY += player.speed.y;
		positionY = between(positionY, 0, map.height, function () {
			speedY *= -1;
		});

		// Set new values
		player.speed = Vector(speedX, speedY);
		player.position = Point(positionX, positionY);
	}
}

// Lil helper function
function between(val: number, min: number, max: number, effect?: () => void) {
	if (val < min) {
		if (effect) {
			effect();
		}
		return min;
	} else if (val > max) {
		if (effect) {
			effect();
		}
		return max;
	} else {
		return val;
	}
}

function serverPlayerToClientPlayer(player: ServerPlayer): ClientPlayer {
	return {
		id: player.id,
		position: player.position
	};
}

export default {
	init
};
