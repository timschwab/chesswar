import { Circle, Point, Vector } from "../common/data-types/shapes.ts";
import { PlayerType } from "../common/data-types/types-base.ts";
import map from "../common/map.ts";
import { gameEngine } from "../common/settings.ts";
import { inside } from "../common/shape-logic/inside.ts";
import { touches } from "../common/shape-logic/touches.ts";
import { spawnPlayer } from "./spawn.ts";
import state, { ServerPlayer, ServerPlayerPhysics } from "./state.ts";

export function tickPlayers() {
	for (const player of state.allPlayers.values()) {
		movePlayer(player.physics);
		checkDeathRects(player);
		checkDeathCircles(player);

		player.canSwitchTo = canSwitchTo(player);
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
	let positionX = physics.position.center.x;
	positionX += physics.speed.x;
	positionX = between(positionX, 0, map.width, function () {
		speedX *= -1;
	});

	let positionY = physics.position.center.y;
	positionY += physics.speed.y;
	positionY = between(positionY, 0, map.height, function () {
		speedY *= -1;
	});

	// Set new values
	physics.speed = Vector(speedX, speedY);
	physics.position = Circle(Point(positionX, positionY), gameEngine.playerRadius);
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
	for (const deathRect of map.deathRects) {
		if (touches(player.physics.position, deathRect)) {
			player.physics = spawnPlayer(player.team);
		}
	}
}

function checkDeathCircles(player: ServerPlayer): void {
	for (const deathCircle of map.deathCircles) {
		if (touches(player.physics.position, deathCircle)) {
			player.physics = spawnPlayer(player.team);
		}
	}
}

function canSwitchTo(player: ServerPlayer): PlayerType | null {
	const pos = player.physics.position;
	const facilityBundles = map.facilities.filter(fac => fac.team == player.team);

	for (const bundle of facilityBundles) {
		if (inside(pos, bundle.command)) {
			return PlayerType.GENERAL;
		} else if (inside(pos, bundle.armory)) {
			return PlayerType.TANK;
		} else if (inside(pos, bundle.intel)) {
			return PlayerType.SPY;
		}

		for (const briefing of bundle.briefings) {
			if (inside(pos, briefing)) {
				return PlayerType.SOLDIER;
			}
		}
	}

	return null;
}
