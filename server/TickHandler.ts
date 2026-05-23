import { TAU_HALF } from "../common/Constants.ts";
import { DeathCause, PlayerAction, PlayerRole, TeamName } from "../common/data-types/base.ts";
import { CarryLoadType } from "../common/data-types/carryLoad.ts";
import { ChessPiece } from "../common/data-types/chess.ts";
import { SerializedClientPlayer } from "../common/data-types/client.ts";
import { mapGeometry } from "../common/map/MapValues.ts";
import { ServerMessageTypes, TeamMessage, TeamMessagePayload } from "../common/message-types/server.ts";
import { gameEngine } from "../common/settings.ts";
import { Circle } from "../common/shapes/Circle.ts";
import { Point } from "../common/shapes/Point.ts";
import { Vector } from "../common/shapes/Vector.ts";
import { ZeroVector } from "../common/shapes/Zero.ts";
import { EventHandler } from "./EventHandler.ts";
import { SocketManager } from "./SocketManager.ts";
import { spawnPlayer } from "./spawn.ts";
import { getState, resetState, ServerPlayer } from "./state.ts";

export class TickHandler {
	private readonly socketManager: SocketManager;
	private readonly eventHandler: EventHandler;

	constructor(socketManager: SocketManager, eventHandler: EventHandler) {
		this.socketManager = socketManager;
		this.eventHandler = eventHandler;
	}

	tick() {
		try {
			const startTick = performance.now();
			this.tickAll();
			const endTick = performance.now();
			const tickMs = endTick-startTick;
			getState().stats.tickMs = tickMs;
			if (tickMs > 25) {
				console.warn("Long tick warning: " + tickMs);
			}
		} catch (ex) {
			console.error("Error occurred while server ticking");
			console.error(ex);
		}
	}

	private tickAll() {
		if (getState().newGameCounter === 0) {
			this.resetGame();
		}
		const state = getState();
	
		this.tickPlayers();
		this.tickTankKills();
	
		if (state.victory == null) {
			this.tickVictory();
		} else {
			this.tickNewGame();
		}
	
		// Broadcast state to everyone
		const playerList = Array.from(state.allPlayers.values());
		const payload = {
			players: playerList.map(this.serverPlayerToClientPlayer),
			victory: state.victory,
			newGameCounter: state.newGameCounter
		};
	
		this.socketManager.sendAll({
			type: ServerMessageTypes.STATE,
			payload: payload
		});
	
		// Broadcast team state to each team. Not really necessary to send every tick.
		for (const name of Object.values(TeamName)) {
			const team = state[name];
			const teamPlayerIds = Array.from(team.playerMap.values()).map(player => player.id);
			const teamPayload: TeamMessagePayload = {
				board: team.teamBoard,
				briefings: team.briefings,
				enemyBriefings: team.enemyBriefings
			};
			const teamMessage: TeamMessage = {
				type: ServerMessageTypes.TEAM,
				payload: teamPayload
			};
	
			this.socketManager.sendBulk(teamPlayerIds, teamMessage);
		}
	
		// Broadcast stats
		this.socketManager.sendAll({
			type: ServerMessageTypes.STATS,
			payload: state.stats
		});
	
		state.count++;
	}

	private serverPlayerToClientPlayer(player: ServerPlayer): SerializedClientPlayer {
		return {
			id: player.id,
			team: player.team,
			role: player.role,
			actionOption: player.actionOption,
			position: player.physics.position.serialize(),
			deathCounter: player.deathCounter
		};
	}

	private resetGame() {
		// Store player IDs
		const playerIds = getState().allPlayers.keys();
	
		// Reset state
		resetState();
	
		// Add all players
		for (const playerId of playerIds) {
			this.eventHandler.addPlayer(playerId);
		}
	}

	private tickPlayers() {
		for (const player of getState().allPlayers.values()) {
			if (player.deathCounter > 0) {
				this.moveDeathCounter(player);
			} else {
				this.movePlayer(player);
			}
	
			this.checkMinefields(player);
			this.checkTankSafezones(player);
	
			player.actionOption = this.actionOption(player);
		}
	}

	private moveDeathCounter(player: ServerPlayer) {
		player.deathCounter--;
	}

	private movePlayer(player: ServerPlayer) {
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
			inputForce = Vector.fromPoint(new Point(xDir, yDir)).withMagnitude(inputForceMag);
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
		} else if (bouncePosition.x > mapGeometry.rect.width) {
			const bounceX = mapGeometry.rect.width - (bouncePosition.x - mapGeometry.rect.width);
			bouncePosition = new Point(bounceX, bouncePosition.y);
			bounceSpeed = new Point(-1*bounceSpeed.x, bounceSpeed.y);
		}
	
		if (bouncePosition.y < 0) {
			const bounceY = 0 - (bouncePosition.y - 0);
			bouncePosition = new Point(bouncePosition.x, bounceY);
			bounceSpeed = new Point(bounceSpeed.x, -1*bounceSpeed.y);
	
		} else if (bouncePosition.y > mapGeometry.rect.height) {
			const bounceY = mapGeometry.rect.height - (bouncePosition.y - mapGeometry.rect.height);
			bouncePosition = new Point(bouncePosition.x, bounceY);
			bounceSpeed = new Point(bounceSpeed.x, -1*bounceSpeed.y);
		}
	
		// Set new values
		physics.speed = Vector.fromPoint(bounceSpeed);
		physics.position = new Circle(bouncePosition, radius);
	}

	private checkMinefields(player: ServerPlayer) {
		for (const minefield of mapGeometry.minefields) {
			if (player.physics.position.touches(minefield)) {
				spawnPlayer(this.socketManager, player);
				this.socketManager.sendOne(player.id, {
					type: ServerMessageTypes.DEATH,
					payload: DeathCause.MINEFIELD
				});
			}
		}
	}

	private checkTankSafezones(player: ServerPlayer) {
		if (player.role == PlayerRole.TANK) {
			const pos = player.physics.position;
			if (pos.touches(mapGeometry.dmz)) {
				spawnPlayer(this.socketManager, player);
				this.socketManager.sendOne(player.id, {
					type: ServerMessageTypes.DEATH,
					payload: DeathCause.MINEFIELD
				});
				return;
			}
	
			const enemyBundles = this.enemyFacilities(player.team);
			for (const bundle of enemyBundles) {
				if (pos.touches(bundle.base)) {
					spawnPlayer(this.socketManager, player);
					this.socketManager.sendOne(player.id, {
						type: ServerMessageTypes.DEATH,
						payload: DeathCause.MINEFIELD
					});
					return;
				}
	
				for (const outpost of bundle.outposts) {
					if (pos.touches(outpost)) {
						spawnPlayer(this.socketManager, player);
						this.socketManager.sendOne(player.id, {
							type: ServerMessageTypes.DEATH,
							payload: DeathCause.MINEFIELD
						});
						return;
					}
				}
			}
		}
	}

	private actionOption(player: ServerPlayer) {
		if (player.role === PlayerRole.GENERAL) {
			return PlayerAction.BECOME_SOLDIER;
		}
	
		const pos = player.physics.position;
	
		// Check our facilities
		const bundle = mapGeometry.teamBundles[player.team];
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
		} else if (pos.inside(mapGeometry.battlefield)) {
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
	
		// Check enemy facilities
		for (const bundle of this.enemyFacilities(player.team)) {
			if (player.role == PlayerRole.OPERATIVE && pos.inside(bundle.command)) {
				return PlayerAction.CONDUCT_ESPIONAGE;
			}
		}
	
		// Nothing to do
		return PlayerAction.NONE;
	}

	private enemyFacilities(teamName: TeamName) {
		return Object.entries(mapGeometry.teamBundles)
			.filter(entry => entry[0] !== teamName)
			.map(entry => entry[1]);
	}

	private tickTankKills() {
		const state = getState();
		// Should optimize this functions at some point probably. Simple-ish optimization would be
		// separating the map into several sectors and only consider the players in that sector or the
		// neighboring ones. But so far I haven't seen a problem.

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
					spawnPlayer(this.socketManager, blueTank);
					this.socketManager.sendOne(blueTank.id, {
						type: ServerMessageTypes.DEATH,
						payload: DeathCause.TANK
					});

					spawnPlayer(this.socketManager, redTank);
					this.socketManager.sendOne(redTank.id, {
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
						spawnPlayer(this.socketManager, redOther);
						this.socketManager.sendOne(redOther.id, {
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
						spawnPlayer(this.socketManager, blueOther);
						this.socketManager.sendOne(blueOther.id, {
							type: ServerMessageTypes.DEATH,
							payload: DeathCause.TANK
						});
					}
				}
			}
		}
	}

	private tickVictory() {
		const state = getState();
		const kings = {
			[TeamName.BLUE]: this.kingExists(TeamName.BLUE),
			[TeamName.RED]: this.kingExists(TeamName.RED)
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

	// We could def improve this, but eh it's just 64 locations
	private kingExists(team: TeamName): boolean {
		for (const row of getState().realBoard) {
			for (const col of row) {
				if (col.contents != null && col.contents.team === team && col.contents.piece === ChessPiece.KING) {
					return true;
				}
			}
		}
		
		return false;
	}

	private tickNewGame(): void {
		const state = getState();
		if (state.newGameCounter == Infinity) {
			state.newGameCounter = gameEngine.newGameTicks;
		}

		state.newGameCounter--;
	}
}
