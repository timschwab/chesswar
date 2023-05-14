import { Circle } from "./shapes.ts";
import { ChesswarId, PlayerRole, TeamName } from "./types-base.ts";

export interface ClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	canSwitchTo: PlayerRole | null,
	position: Circle
}
