import { Circle, Point, Vector } from "../common/data-types/shapes.ts";
import { PlayerAction, PlayerRole, TeamName } from "../common/data-types/base.ts";
import map from "../common/map.ts";
import { gameEngine } from "../common/settings.ts";
import { inside } from "../common/shape-logic/inside.ts";
import { touches } from "../common/shape-logic/touches.ts";
import { transposePoint } from "../common/shape-logic/transpose.ts";
import { TAU_HALF, add, multiply, pointToVector, vectorToPoint } from "../common/shape-logic/vector.ts";
import { spawnPlayer } from "./spawn.ts";
import state, { ServerPlayer } from "./state.ts";
import { ChessPiece } from "../common/data-types/chess.ts";
import { CarryLoadType } from "../common/data-types/server.ts";

export function tickPlayers() {
	for (const player of state.allPlayers.values()) {
		if (player.deathCounter > 0) {
			moveDeathCounter(player);
		} else {
			movePlayer(player);
		}

		checkDeathRects(player);
		checkDeathCircles(player);
		checkTankSafezones(player);

		player.actionOption = actionOption(player);
	}
}

function movePlayer(player: ServerPlayer): void {
	const physics = player.physics;
	const radius = gameEngine.physics[player.role].radius;
	

	// Compute input force
	const pos = gameEngine.physics[player.role].inputForceMag;
	const neg = -1*pos;

	const left = player.movement.left ? neg : 0;
	const right = player.movement.right ? pos : 0;
	const up = player.movement.up ? neg : 0;
	const down = player.movement.down ? pos : 0;

	const xDir = left + right;
	const yDir = up + down;

	const inputForce = pointToVector(Point(xDir, yDir));

	// Compute net force based on input force, friction, and drag
	const oppositeDir = physics.speed.dir + TAU_HALF;
	const playerSpeed = physics.speed.mag;
	const frictionMag = Math.min(gameEngine.frictionCoef * physics.mass, playerSpeed);
	const dragMag = gameEngine.dragCoef*playerSpeed;

	const frictionForce = Vector(frictionMag, oppositeDir);
	const dragForce = Vector(dragMag, oppositeDir);

	const netForce = add(add(inputForce, frictionForce), dragForce);

	// Compute speed based on force and mass
	const netAcceleration = multiply(netForce, 1/physics.mass);
	const newSpeed = add(physics.speed, netAcceleration);

	// Compute position based on speed
	const xyVector = vectorToPoint(newSpeed);
	const newPosition = transposePoint(physics.position.center, xyVector);

	// Bounce off the sides
	let bouncePosition = newPosition;
	let bounceSpeed = xyVector;

	if (bouncePosition.x < 0) {
		const bounceX = 0 - (bouncePosition.x - 0);
		bouncePosition = Point(bounceX, bouncePosition.y);
		bounceSpeed = Point(-1*bounceSpeed.x, bounceSpeed.y);
	} else if (bouncePosition.x > map.width) {
		const bounceX = map.width - (bouncePosition.x - map.width);
		bouncePosition = Point(bounceX, bouncePosition.y);
		bounceSpeed = Point(-1*bounceSpeed.x, bounceSpeed.y);
	}

	if (bouncePosition.y < 0) {
		const bounceY = 0 - (bouncePosition.y - 0);
		bouncePosition = Point(bouncePosition.x, bounceY);
		bounceSpeed = Point(bounceSpeed.x, -1*bounceSpeed.y);

	} else if (bouncePosition.y > map.height) {
		const bounceY = map.height - (bouncePosition.y - map.height);
		bouncePosition = Point(bouncePosition.x, bounceY);
		bounceSpeed = Point(bounceSpeed.x, -1*bounceSpeed.y);
	}

	// Set new values
	physics.speed = pointToVector(bounceSpeed);
	physics.position = Circle(bouncePosition, radius);
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

function checkTankSafezones(player: ServerPlayer): void {
	if (player.role == PlayerRole.TANK) {
		const pos = player.physics.position;
		if (touches(pos, map.safeZone)) {
			spawnPlayer(player);
			return;
		}

		const enemyBundles = map.facilities.filter(fac => fac.team != player.team);
		for (const bundle of enemyBundles) {
			if (touches(pos, bundle.base)) {
				spawnPlayer(player);
				return;
			}

			for (const outpost of bundle.outposts) {
				if (touches(pos, outpost)) {
					spawnPlayer(player);
					return;
				}
			}
		}
	}
}

function moveDeathCounter(player: ServerPlayer) {
	player.deathCounter--;
}

function actionOption(player: ServerPlayer): PlayerAction | null {
	if (player.role == PlayerRole.GENERAL) {
		return PlayerAction.BECOME_SOLDIER;
	}

	const pos = player.physics.position;
	for (const bundle of map.facilities) {
		if (bundle.team == player.team) {
			if (inside(pos, bundle.command)) {
				if (player.carrying.type == CarryLoadType.ESPIONAGE) {
					return PlayerAction.REPORT_ESPIONAGE;
				} else if (player.carrying.type == CarryLoadType.INTEL) {
					return PlayerAction.REPORT_INTEL;
				} else {
					return PlayerAction.BECOME_GENERAL;
				}
			} else if (inside(pos, bundle.armory)) {
				return PlayerAction.BECOME_TANK;
			} else if (inside(pos, bundle.scif)) {
				if (player.role == PlayerRole.OPERATIVE) {
					if (player.carrying.type == CarryLoadType.ESPIONAGE) {
						return PlayerAction.REPORT_ESPIONAGE;
					} else if (player.carrying.type == CarryLoadType.INTEL) {
						return PlayerAction.REPORT_INTEL;
					}
				} else {
					return PlayerAction.BECOME_OPERATIVE;
				}
			} else if (inside(pos, map.battlefield)) {
				if (player.role == PlayerRole.SOLDIER && player.carrying.type == CarryLoadType.ORDERS) {
					return PlayerAction.COMPLETE_ORDERS;
				} else if (player.role == PlayerRole.OPERATIVE) {
					return PlayerAction.GATHER_INTEL;
				}
			} else {
				for (const brief of bundle.briefings) {
					if (inside(pos, brief)) {
						if (player.role == PlayerRole.SOLDIER) {
							return PlayerAction.GRAB_ORDERS;
						} else {
							return PlayerAction.BECOME_SOLDIER;
						}
					}
				}
			}
		} else {
			if (player.role == PlayerRole.OPERATIVE && inside(pos, bundle.command)) {
				return PlayerAction.CONDUCT_ESPIONAGE;
			}
		}
	}

	return null;
}

export function tickTankKills(): void {
	// Should optimize this functions at some point probably. Simple-ish optimization would be
	// separating the map into several sectors and only consider the players in that sector or the
	// neighboring ones.

	// List of values
	const alphaTanks: ServerPlayer[] = [];
	const alphaOthers: ServerPlayer[] = [];
	const bravoTanks: ServerPlayer[] = [];
	const bravoOthers: ServerPlayer[] = [];

	for (const player of state.allPlayers.values()) {
		if (player.team == TeamName.ALPHA) {
			if (player.role == PlayerRole.TANK) {
				alphaTanks.push(player);
			} else {
				alphaOthers.push(player);
			}
		} else if (player.team == TeamName.BRAVO) {
			if (player.role == PlayerRole.TANK) {
				bravoTanks.push(player);
			} else {
				bravoOthers.push(player);
			}
		}
	}

	// Tanks killing tanks first - compare every pair
	for (const alphaTank of alphaTanks) {
		for (const bravoTank of bravoTanks) {
			if (touches(alphaTank.physics.position, bravoTank.physics.position)) {
				spawnPlayer(alphaTank);
				spawnPlayer(bravoTank);
			}
		}
	}

	// Tanks killing soldiers and spies second
	for (const alphaTank of alphaTanks) {
		// Make sure it wasn't killed up above
		if (alphaTank.role == PlayerRole.TANK) {
			for (const bravoOther of bravoOthers) {
				if (touches(alphaTank.physics.position, bravoOther.physics.position)) {
					spawnPlayer(bravoOther);
				}
			}
		}
	}

	for (const bravoTank of bravoTanks) {
		// Make sure it wasn't killed up above
		if (bravoTank.role == PlayerRole.TANK) {
			for (const alphaOther of alphaOthers) {
				if (touches(bravoTank.physics.position, alphaOther.physics.position)) {
					spawnPlayer(alphaOther);
				}
			}
		}
	}
}

export function tickVictory(): void {
	const kings = {
		[TeamName.ALPHA]: kingExists(TeamName.ALPHA),
		[TeamName.BRAVO]: kingExists(TeamName.BRAVO)
	};

	if (kings[TeamName.ALPHA] && kings[TeamName.BRAVO]) {
		state.victory = null;
	} else if (kings[TeamName.ALPHA] && !kings[TeamName.BRAVO]) {
		state.victory = TeamName.ALPHA;
	} else if (!kings[TeamName.ALPHA] && kings[TeamName.BRAVO]) {
		state.victory = TeamName.BRAVO;
	} else {
		state.victory = "tie";
	}
}

// We could def store this, but eh it's just 64 locations
function kingExists(team: TeamName): boolean {
	for (const row of state.realBoard) {
		for (const col of row) {
			if (col != null && col.team == team && col.piece == ChessPiece.KING) {
				return true;
			}
		}
	}

	return false;
}
