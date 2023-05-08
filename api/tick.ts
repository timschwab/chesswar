import { Circle, Point, Vector } from "../common/data-types/structures.ts";
import map from "../common/map.ts";
import { gameEngine } from "../common/settings.ts";
import { touches } from "../common/structure-logic/touches.ts";
import { spawnPlayer } from "./spawn.ts";
import state, { ServerPlayer, ServerPlayerPhysics } from "./state.ts";

export function tickPlayers() {
	for (const player of state.allPlayers.values()) {
		movePlayer(player.physics);
		checkDeathRects(player);
		checkDeathCircles(player);
	}
}

function movePlayer(physics: ServerPlayerPhysics): void {
	const posSpeed = gameEngine.maxSpeed;
	const negSpeed = -1 * posSpeed;

	// Compute speed based on acceleration
	let speedX = physics.speed.x
	speedX += physics.acceleration.x;
	speedX = between(speedX, negSpeed, posSpeed);

	let speedY = physics.speed.y
	speedY += physics.acceleration.y;
	speedY = between(speedY, negSpeed, posSpeed);

	// Compute position based on speed, and bounce off the sides
	let positionX = physics.position.x;
	positionX += physics.speed.x;
	positionX = between(positionX, 0, map.width, function () {
		speedX *= -1;
	});

	let positionY = physics.position.y;
	positionY += physics.speed.y;
	positionY = between(positionY, 0, map.height, function () {
		speedY *= -1;
	});

	// Set new values
	physics.speed = Vector(speedX, speedY);
	physics.position = Point(positionX, positionY);
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

function checkDeathRects(player: ServerPlayer): void {
	const playerCircle = Circle(player.physics.position, gameEngine.playerRadius);

	for (const deathRect of map.deathRects) {
		if (touches(playerCircle, deathRect)) {
			player.physics = spawnPlayer(player.team);
		}
	}
}

function checkDeathCircles(player: ServerPlayer): void {
	const playerCircle = Circle(player.physics.position, gameEngine.playerRadius);

	for (const deathCircle of map.deathCircles) {
		if (touches(playerCircle, deathCircle)) {
			player.physics = spawnPlayer(player.team);
		}
	}
}
