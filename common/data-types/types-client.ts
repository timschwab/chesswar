import { Circle } from "./shapes.ts";
import { ChesswarId, TeamName } from "./types-base.ts";

export interface ClientPlayer {
	id: ChesswarId,
	team: TeamName,
	position: Circle
}
