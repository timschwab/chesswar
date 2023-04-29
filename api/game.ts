import settings from "./settings.ts";
import socket from "./socket.ts";
import map from "../common/map.ts";
import { ClientMessageWithId, KeysMessagePayload } from "../common/message-types.ts";

interface Player {
	id: string,
	acceleration: {
		x: number,
		y: number
	},
	speed: {
		x: number,
		y: number
	},
	position: {
		x: number,
		y: number
	}
}

const state = {
	players: new Map<string, Player>()
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
		acceleration: {
			x: 0,
			y: 0
		},
		speed: {
			x: 0,
			y: 0
		},
		position: {
			x: map.start.x,
			y: map.start.y
		}
	});

	socket.send(id, {
		type: "player-init",
		payload: {
			id
		}
	});
}

function removePlayer(id: string): void {
	state.players.delete(id);
}

function getPlayer(id: string): Player {
	const player = state.players.get(id);
	if (player) {
		return player;
	} else {
		throw "Could not find player: " + id;
	}
}

function receiveMessage(message: ClientMessageWithId): void {
	if (message.type == "keys") {
		keysUpdate(message.id, message.payload);
	}
}

function keysUpdate(id: string, keys: KeysMessagePayload): void {
	const pos = settings.acceleration;
	const neg = -1 * pos;

	// Compute acceleration
	const left = keys.left ? neg : 0;
	const right = keys.right ? pos : 0;
	const up = keys.up ? neg : 0;
	const down = keys.down ? pos : 0;

	const acceleration = {
		x: left + right,
		y: up + down
	};

	getPlayer(id).acceleration = acceleration;
}

function tick(): void {
	const posSpeed = settings.maxSpeed;
	const negSpeed = -1 * posSpeed;

	for (const player of state.players.values()) {
		// Update player positions

		// Change speed based on acceleration
		player.speed.x += player.acceleration.x;
		player.speed.x = between(player.speed.x, negSpeed, posSpeed);

		player.speed.y += player.acceleration.y;
		player.speed.y = between(player.speed.y, negSpeed, posSpeed);

		// Change position based on speed, and bounce off the sides
		player.position.x += player.speed.x;
		player.position.x = between(player.position.x, 0, map.width, function () {
			player.speed.x *= -1;
		});

		player.position.y += player.speed.y;
		player.position.y = between(player.position.y, 0, map.height, function () {
			player.speed.y *= -1;
		});
	}

	// Broadcast to everyone
	const payload = Array.from(state.players.values()).map(player => {
		return {
			player: player.id,
			position: player.position
		};
	});

	socket.broadcast({
		type: "state",
		payload: payload
	});
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

export default {
	init
};
