import { DeathCause, PlayerAction, PlayerRole, TeamName } from "../common/data-types/base.ts";
import map from "../common/map.ts";
import { gameEngine } from "../common/settings.ts";
import { spawnPlayer } from "./spawn.ts";
import { ServerPlayer, getState } from "./state.ts";
import { ChessPiece } from "../common/data-types/chess.ts";
import { CarryLoadType } from "../common/data-types/carryLoad.ts";
import socket from "./socket.ts";
import { ServerMessageTypes } from "../common/message-types/server.ts";
import { Point } from "../common/shapes/Point.ts";
import { Vector } from "../common/shapes/Vector.ts";
import { TAU_HALF } from "../common/Constants.ts";
import { Circle } from "../common/shapes/Circle.ts";
import { ZeroVector } from "../common/shapes/Zero.ts";

export function tickPlayers() {
	const state = getState();
	for (const player of state.allPlayers.values()) {
		if (player.deathCounter > 0) {
			moveDeathCounter(player);
		} else {
			movePlayer(player);
		}

		checkMinefields(player);
		checkTankSafezones(player);

		player.actionOption = actionOption(player);
	}
}

function movePlayer(player: ServerPlayer): void {
	const physics = player.physics;
	const radius = gameEngine.physics[player.role].radius;
	
	// Compute input force
	const inputForceMag = gameEngine.physics[player.role].inputForceMag;

	const left = player.movement.left ? -1 : 0;
	const right = player.movement.right ? 1 : 0;
	const up = player.movement.up ? -1 : 0;
	const down = player.movement.down ? 1 : 0;

	const xDir = left + right;
	const yDir = up + down;

	let inputForce: Vector;
	if (xDir == 0 && yDir == 0) {
		inputForce = ZeroVector;
	} else {
		inputForce = Vector.fromPoint(new Point(xDir, yDir)).normalize().multiply(inputForceMag);
	}

	// Compute net force based on input force, friction, and drag
	const oppositeDir = physics.speed.dir + TAU_HALF;
	const playerSpeed = physics.speed.mag;
	const frictionMag = Math.min(gameEngine.frictionCoef * physics.mass, playerSpeed);
	const dragMag = gameEngine.dragCoef*playerSpeed;

	const frictionForce = new Vector(oppositeDir, frictionMag);
	const dragForce = new Vector(oppositeDir, dragMag);

	const netForce = inputForce.add(frictionForce).add(dragForce);

	// Compute speed based on force and mass
	const netAcceleration = netForce.divide(physics.mass);
	const newSpeed = physics.speed.add(netAcceleration);

	// Compute position based on speed
	const xyVector = newSpeed.toPoint();
	const newPosition = physics.position.center.add(xyVector);

	// Bounce off the sides
	let bouncePosition = newPosition;
	let bounceSpeed = xyVector;

	if (bouncePosition.x < 0) {
		const bounceX = 0 - (bouncePosition.x - 0);
		bouncePosition = new Point(bounceX, bouncePosition.y);
		bounceSpeed = new Point(-1*bounceSpeed.x, bounceSpeed.y);
	} else if (bouncePosition.x > map.width) {
		const bounceX = map.width - (bouncePosition.x - map.width);
		bouncePosition = new Point(bounceX, bouncePosition.y);
		bounceSpeed = new Point(-1*bounceSpeed.x, bounceSpeed.y);
	}

	if (bouncePosition.y < 0) {
		const bounceY = 0 - (bouncePosition.y - 0);
		bouncePosition = new Point(bouncePosition.x, bounceY);
		bounceSpeed = new Point(bounceSpeed.x, -1*bounceSpeed.y);

	} else if (bouncePosition.y > map.height) {
		const bounceY = map.height - (bouncePosition.y - map.height);
		bouncePosition = new Point(bouncePosition.x, bounceY);
		bounceSpeed = new Point(bounceSpeed.x, -1*bounceSpeed.y);
	}

	// Set new values
	physics.speed = Vector.fromPoint(bounceSpeed);
	physics.position = new Circle(bouncePosition, radius);
}

function checkMinefields(player: ServerPlayer): void {
	for (const minefield of map.minefields) {
		if (player.physics.position.touches(minefield)) {
			spawnPlayer(player);
			socket.sendOne(player.id, {
				type: ServerMessageTypes.DEATH,
				payload: DeathCause.MINEFIELD
			});
		}
	}
}

function checkTankSafezones(player: ServerPlayer): void {
	if (player.role == PlayerRole.TANK) {
		const pos = player.physics.position;
		if (pos.touches(map.safeZone)) {
			spawnPlayer(player);
			socket.sendOne(player.id, {
				type: ServerMessageTypes.DEATH,
				payload: DeathCause.MINEFIELD
			});
			return;
		}

		const enemyBundles = map.facilities.filter(fac => fac.team != player.team);
		for (const bundle of enemyBundles) {
			if (pos.touches(bundle.base)) {
				spawnPlayer(player);
				socket.sendOne(player.id, {
					type: ServerMessageTypes.DEATH,
					payload: DeathCause.MINEFIELD
				});
				return;
			}

			for (const outpost of bundle.outposts) {
				if (pos.touches(outpost)) {
					spawnPlayer(player);
					socket.sendOne(player.id, {
						type: ServerMessageTypes.DEATH,
						payload: DeathCause.MINEFIELD
					});
					return;
				}
			}
		}
	}
}

function moveDeathCounter(player: ServerPlayer) {
	player.deathCounter--;
}

function actionOption(player: ServerPlayer): PlayerAction {
	if (player.role == PlayerRole.GENERAL) {
		return PlayerAction.BECOME_SOLDIER;
	}

	const pos = player.physics.position;
	for (const bundle of map.facilities) {
		if (bundle.team == player.team) {
			if (pos.inside(bundle.command)) {
				return PlayerAction.BECOME_GENERAL;
			} else if (pos.inside(bundle.armory)) {
				if (player.role == PlayerRole.TANK) {
					// Do nothing
				} else {
					return PlayerAction.BECOME_TANK;
				}
			} else if (pos.inside(bundle.scif)) {
				if (player.role == PlayerRole.OPERATIVE) {
					if (player.carrying.type == CarryLoadType.ESPIONAGE) {
						return PlayerAction.REPORT_ESPIONAGE;
					} else if (player.carrying.type == CarryLoadType.INTEL) {
						return PlayerAction.REPORT_INTEL;
					}
				} else {
					return PlayerAction.BECOME_OPERATIVE;
				}
			} else if (pos.inside(map.battlefield)) {
				if (player.role == PlayerRole.SOLDIER && player.carrying.type == CarryLoadType.ORDERS) {
					return PlayerAction.COMPLETE_ORDERS;
				} else if (player.role == PlayerRole.OPERATIVE) {
					return PlayerAction.GATHER_INTEL;
				}
			} else {
				for (const brief of bundle.briefings) {
					if (pos.inside(brief)) {
						return PlayerAction.GRAB_ORDERS;
					}
				}
			}
		} else {
			if (player.role == PlayerRole.OPERATIVE && pos.inside(bundle.command)) {
				return PlayerAction.CONDUCT_ESPIONAGE;
			}
		}
	}

	return PlayerAction.NONE;
}

export function tickTankKills(): void {
	const state = getState();
	// Should optimize this functions at some point probably. Simple-ish optimization would be
	// separating the map into several sectors and only consider the players in that sector or the
	// neighboring ones.

	// List of values
	const blueTanks: ServerPlayer[] = [];
	const blueOthers: ServerPlayer[] = [];
	const redTanks: ServerPlayer[] = [];
	const redOthers: ServerPlayer[] = [];

	for (const player of state.allPlayers.values()) {
		if (player.team == TeamName.BLUE) {
			if (player.role == PlayerRole.TANK) {
				blueTanks.push(player);
			} else {
				blueOthers.push(player);
			}
		} else if (player.team == TeamName.RED) {
			if (player.role == PlayerRole.TANK) {
				redTanks.push(player);
			} else {
				redOthers.push(player);
			}
		}
	}

	// Tanks killing tanks first - compare every pair
	for (const blueTank of blueTanks) {
		for (const redTank of redTanks) {
			if (blueTank.physics.position.touches(redTank.physics.position)) {
				spawnPlayer(blueTank);
				socket.sendOne(blueTank.id, {
					type: ServerMessageTypes.DEATH,
					payload: DeathCause.TANK
				});

				spawnPlayer(redTank);
				socket.sendOne(redTank.id, {
					type: ServerMessageTypes.DEATH,
					payload: DeathCause.TANK
				});
			}
		}
	}

	// Tanks killing soldiers and spies second
	for (const blueTank of blueTanks) {
		// Make sure it wasn't killed up above
		if (blueTank.role == PlayerRole.TANK) {
			for (const redOther of redOthers) {
				if (blueTank.physics.position.touches(redOther.physics.position)) {
					spawnPlayer(redOther);
					socket.sendOne(redOther.id, {
						type: ServerMessageTypes.DEATH,
						payload: DeathCause.TANK
					});
				}
			}
		}
	}

	for (const redTank of redTanks) {
		// Make sure it wasn't killed up above
		if (redTank.role == PlayerRole.TANK) {
			for (const blueOther of blueOthers) {
				if (redTank.physics.position.touches(blueOther.physics.position)) {
					spawnPlayer(blueOther);
					socket.sendOne(blueOther.id, {
						type: ServerMessageTypes.DEATH,
						payload: DeathCause.TANK
					});
				}
			}
		}
	}
}

export function tickVictory(): void {
	const state = getState();
	const kings = {
		[TeamName.BLUE]: kingExists(TeamName.BLUE),
		[TeamName.RED]: kingExists(TeamName.RED)
	};

	if (kings[TeamName.BLUE] && kings[TeamName.RED]) {
		state.victory = null;
	} else if (kings[TeamName.BLUE] && !kings[TeamName.RED]) {
		state.victory = TeamName.BLUE;
	} else if (!kings[TeamName.BLUE] && kings[TeamName.RED]) {
		state.victory = TeamName.RED;
	} else {
		state.victory = "tie";
	}
}

// We could def store this, but eh it's just 64 locations
function kingExists(team: TeamName): boolean {
	const state = getState();
	for (const row of state.realBoard) {
		for (const col of row) {
			if (col != null && col.team == team && col.piece == ChessPiece.KING) {
				return true;
			}
		}
	}
	
	return false;
}

export function tickNewGame(): void {
	const state = getState();
	if (state.newGameCounter == Infinity) {
		state.newGameCounter = gameEngine.newGameTicks;
	}

	state.newGameCounter--;
}
