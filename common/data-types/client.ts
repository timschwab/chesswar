import { SerializedCircle } from "../shapes/Circle.ts";
import { ChesswarId, PlayerAction, PlayerRole, TeamName } from "./base.ts";

export interface SerializedClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	actionOption: PlayerAction,
	position: SerializedCircle,
	deathCounter: number
}
