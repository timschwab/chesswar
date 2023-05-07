import { Point, Vector } from "../common/data-types/structures.ts";
import { ChesswarId, TeamName } from "../common/data-types/types-base.ts";

export interface ServerPlayerPhysics {
	acceleration: Vector,
	speed: Vector,
	position: Point
}

export interface ServerPlayer {
	id: ChesswarId,
	team: TeamName,
	physics: ServerPlayerPhysics
}

type PlayerMap = Map<ChesswarId, ServerPlayer>;

interface Team {
	playerMap: PlayerMap
}

interface ServerState {
	allPlayers: PlayerMap,
	[TeamName.ALPHA]: Team,
	[TeamName.BRAVO]: Team
}

const state: ServerState = {
	allPlayers: new Map<ChesswarId, ServerPlayer>(),
	[TeamName.ALPHA]: {
		playerMap: new Map<ChesswarId, ServerPlayer>()
	},
	[TeamName.BRAVO]: {
		playerMap: new Map<ChesswarId, ServerPlayer>()
	}
};

export default state;
