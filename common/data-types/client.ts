import { SerializedCircle } from "../shapes/Circle.ts";
import { ChesswarId, PlayerAction, PlayerRole, TeamName } from "./base.ts";

export interface SerializedClientPlayerState {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	actionOption: PlayerAction | null,
	position: SerializedCircle,
	deathCounter: number
}
