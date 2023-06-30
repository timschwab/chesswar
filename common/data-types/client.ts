import { Circle } from "../shapes/types.ts";
import { ChesswarId, PlayerAction, PlayerRole, TeamName, newGameVote } from "./base.ts";

export interface ClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	actionOption: PlayerAction | null,
	position: Circle,
	deathCounter: number,
	vote: newGameVote
}
