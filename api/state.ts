import { Circle, Vector } from "../common/data-types/shapes.ts";
import { ChesswarId, PlayerType, TeamName } from "../common/data-types/types-base.ts";

export interface ServerPlayerPhysics {
	inputForce: Vector,
	mass: number,
	speed: Vector,
	position: Circle
}

export interface ServerPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerType,
	canSwitchTo: PlayerType | null,
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
