import { Point, Vector } from "../common/data-types/structures.ts";
import map from "../common/map.ts";
import { gameEngine } from "../common/settings.ts";
import state from "./state.ts";

export function tickPlayers() {
	const posSpeed = gameEngine.maxSpeed;
	const negSpeed = -1 * posSpeed;

	for (const player of state.allPlayers.values()) {
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
