import { Circle } from "./shapes.ts";
import { ChesswarId, PlayerType, TeamName } from "./types-base.ts";

export interface ClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerType,
	canSwitchTo: PlayerType | null,
	position: Circle
}
