import { Circle } from "./shapes.ts";
import { ChesswarId, CommandAction, PlayerRole, TeamName } from "./base.ts";

export interface ClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	commandOption: CommandAction | null,
	position: Circle
}
