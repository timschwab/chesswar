import { Circle, Vector } from "../common/data-types/shapes.ts";
import { ChesswarId, CommandAction, PlayerRole, TeamName } from "../common/data-types/types-base.ts";
import { MovementState } from "../common/data-types/types-server.ts";

export interface ServerPlayerPhysics {
	mass: number,
	speed: Vector,
	position: Circle
}

export interface ServerPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	commandOption: CommandAction | null,
	movement: MovementState,
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
