import { Circle } from "./shapes.ts";
import { ChesswarId, PlayerAction, PlayerRole, TeamName } from "./base.ts";

export interface ClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	actionOption: PlayerAction | null,
	position: Circle,
	deathCounter: number
}
