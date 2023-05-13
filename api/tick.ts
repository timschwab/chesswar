import { Circle, Vector } from "../common/data-types/shapes.ts";
import { PlayerType } from "../common/data-types/types-base.ts";
import map from "../common/map.ts";
import { gameEngine } from "../common/settings.ts";
import { inside } from "../common/shape-logic/inside.ts";
import { touches } from "../common/shape-logic/touches.ts";
import { transposePoint } from "../common/shape-logic/transpose.ts";
import { TAU_HALF, add, multiply, vectorToPoint } from "../common/shape-logic/vector.ts";
import { spawnPlayer } from "./spawn.ts";
import state, { ServerPlayer } from "./state.ts";

export function tickPlayers() {
	for (const player of state.allPlayers.values()) {
		movePlayer(player);
		checkDeathRects(player);
		checkDeathCircles(player);

		player.canSwitchTo = canSwitchTo(player);
	}
}

function movePlayer(player: ServerPlayer): void {
	const physics = player.physics;
	const radius = gameEngine.physics[player.role].radius;

	// Compute net force based on force input, friction, and air resistance
	const oppositeDir = physics.speed.dir + TAU_HALF;
	const playerSpeed = physics.speed.mag;
	const frictionMag = Math.min(gameEngine.frictionCoef * physics.mass, playerSpeed);
	const dragMag = gameEngine.dragCoef*(playerSpeed);

	const inputForce = physics.inputForce;
	const frictionForce = Vector(frictionMag, oppositeDir);
	const dragForce = Vector(dragMag, oppositeDir);

	const netForce = add(add(inputForce, frictionForce), dragForce);

	// Compute speed based on force and mass
	const netAcceleration = multiply(netForce, 1/physics.mass);
	const newSpeed = add(physics.speed, netAcceleration);

	// Compute position based on speed, TODO: and bounce off the sides
	const xyVector = vectorToPoint(newSpeed);
	const newPosition = transposePoint(physics.position.center, xyVector);

	// Set new values
	physics.speed = newSpeed;
	physics.position = Circle(newPosition, radius);
}

function checkDeathRects(player: ServerPlayer): void {
	for (const deathRect of map.deathRects) {
		if (touches(player.physics.position, deathRect)) {
			spawnPlayer(player);
		}
	}
}

function checkDeathCircles(player: ServerPlayer): void {
	for (const deathCircle of map.deathCircles) {
		if (touches(player.physics.position, deathCircle)) {
			spawnPlayer(player);
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
