import { ChesswarId, MovementState, PlayerAction, PlayerRole, TeamName, Victory } from "../common/data-types/base.ts";
import { CarryLoad } from "../common/data-types/carryLoad.ts";
import { ChessBoard } from "../common/data-types/chess.ts";
import { BriefingBundle, BriefingName } from "../common/data-types/facility.ts";
import { ServerStats } from "../common/data-types/server.ts";
import { Circle, Vector } from "../common/shapes/types.ts";
import { newBoard } from "./chess.ts";

export interface ServerPlayerPhysics {
	mass: number,
	speed: Vector,
	position: Circle
}

export interface ServerPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	actionOption: PlayerAction | null,
	carrying: CarryLoad,
	movement: MovementState,
	physics: ServerPlayerPhysics,
	deathCounter: number
}

type PlayerMap = Map<ChesswarId, ServerPlayer>;

interface Team {
	playerMap: PlayerMap,
	teamBoard: ChessBoard,
	briefings: BriefingBundle,
	enemyBriefings: BriefingBundle
}

interface ServerState {
	count: number,
	victory: Victory,
	realBoard: ChessBoard,
	allPlayers: PlayerMap,
	[TeamName.BLUE]: Team,
	[TeamName.RED]: Team,
	stats: ServerStats,
	newGameCounter: number
}

function newState(): ServerState {
	return {
		count: 0,
		victory: null,
		realBoard: newBoard(),
		allPlayers: new Map<ChesswarId, ServerPlayer>(),
		[TeamName.BLUE]: {
			playerMap: new Map<ChesswarId, ServerPlayer>(),
			teamBoard: newBoard(),
			briefings: {
				[BriefingName.ONE]: null,
				[BriefingName.TWO]: null,
				[BriefingName.THREE]: null
			},
			enemyBriefings: {
				[BriefingName.ONE]: null,
				[BriefingName.TWO]: null,
				[BriefingName.THREE]: null
			}
		},
		[TeamName.RED]: {
			playerMap: new Map<ChesswarId, ServerPlayer>(),
			teamBoard: newBoard(),
			briefings: {
				[BriefingName.ONE]: null,
				[BriefingName.TWO]: null,
				[BriefingName.THREE]: null
			},
			enemyBriefings: {
				[BriefingName.ONE]: null,
				[BriefingName.TWO]: null,
				[BriefingName.THREE]: null
			}
		},
		stats: {
			tickMs: 0
		},
		newGameCounter: Infinity
	};
}

export function resetState(): void {
	state = newState();
}

export function getState(): ServerState {
	return state;
}

let state = newState();
