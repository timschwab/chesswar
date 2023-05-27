import { ChessBoard, ChessMove, TeamName } from "../common/data-types/types-base.ts";

export function makeMove(board: ChessBoard, team: TeamName, move: ChessMove): void {
	console.log(board, team, move);
}
