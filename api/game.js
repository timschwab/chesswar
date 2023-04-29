import settings from "./settings.ts";
import socket from "./socket.js";
import map from "./map.js";

let state = {
	players: {}
};

function init() {
	socket.listen.event("add", addPlayer);
	socket.listen.event("remove", removePlayer);

	socket.listen.message("keys", keysUpdate);

	setInterval(tick, 50);
}

function addPlayer(id) {
	state.players[id] = {
		id,
		liveness: "alive",
		deathCounter: 0,
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
	};

	socket.send(id, "player-init", {
		id
	});

	socket.send(id, "map", map);
}

function removePlayer(id) {
	delete state.players[id];
}

function keysUpdate(id, keys) {
	let pos = settings.acceleration;
	let neg = -1 * pos;

	// Compute acceleration
	let left = keys.left ? neg : 0;
	let right = keys.right ? pos : 0;
	let up = keys.up ? neg : 0;
	let down = keys.down ? pos : 0;

	let acceleration = {
		x: left + right,
		y: up + down
	};

	state.players[id].acceleration = acceleration;
}

function tick() {
	let posSpeed = settings.maxSpeed;
	let negSpeed = -1 * posSpeed;

	for (let player of Object.values(state.players)) {
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

		// Handle death
		for (let deathRect of map.deathRects) {
			if (pointInRect(player.position, deathRect)) {
				player.liveness = "dead";
				player.deathCounter = settings.deathTicks;
			}
		}
	}

	// Broadcast to everyone
	let payload = Object.values(state.players).reduce((acc, cur) => {
		acc[cur.id] = {
			position: cur.position
		};
		return acc;
	}, {});
	socket.broadcast("players", payload);
}

// Lil helper function
function between(val, min, max, effect) {
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

// Another helper
function pointInRect(point, rect) {
	// Check x
	if (point.x < rect.topLeft.x || point.x > rect.bottomRight.x) {
		return false
	}

	// Check y
	if (point.y < rect.topLeft.y || point.y > rect.bottomRight.y) {
		return false
	}

	return true;
}

export default {
	init
};
