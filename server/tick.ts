import { DeathCause, PlayerAction, PlayerRole, TeamName } from "../common/data-types/base.ts";
import { gameEngine } from "../common/settings.ts";
import { spawnPlayer } from "./spawn.ts";
import { ServerPlayer, getState } from "./state.ts";
import { ChessPiece } from "../common/data-types/chess.ts";
import { CarryLoadType } from "../common/data-types/carryLoad.ts";
import { ServerMessageTypes } from "../common/message-types/server.ts";
import { Point } from "../common/shapes/Point.ts";
import { Vector } from "../common/shapes/Vector.ts";
import { TAU_HALF } from "../common/Constants.ts";
import { Circle } from "../common/shapes/Circle.ts";
import { ZeroVector } from "../common/shapes/Zero.ts";
import { mapGeometry } from "../common/map/MapValues.ts";
import { SocketManager } from "./SocketManager.ts";


export function tickTankKills(socket: SocketManager): void {
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
				spawnPlayer(socket, blueTank);
				socket.sendOne(blueTank.id, {
					type: ServerMessageTypes.DEATH,
					payload: DeathCause.TANK
				});

				spawnPlayer(socket, redTank);
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
					spawnPlayer(socket, redOther);
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
					spawnPlayer(socket, blueOther);
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

// We could def improve this, but eh it's just 64 locations
function kingExists(team: TeamName): boolean {
	const state = getState();
	for (const row of state.realBoard) {
		for (const col of row) {
			if (col.contents != null && col.contents.team == team && col.contents.piece == ChessPiece.KING) {
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

