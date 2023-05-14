import { Circle } from "./shapes.ts";
import { ChesswarId, CommandAction, PlayerRole, TeamName } from "./types-base.ts";

export interface ClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	commandOption: CommandAction | null,
	position: Circle
}
