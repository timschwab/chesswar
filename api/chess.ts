import { ChessBoard, ChessMove, ChessPiece, TeamName } from "../common/data-types/types-base.ts";

export function makeMove(board: ChessBoard, team: TeamName, move: ChessMove): void {
	if (validMove(board, team, move)) {
		board[move.to.row][move.to.col] = board[move.from.row][move.from.col];
		board[move.from.row][move.from.col] = null;
	}
}

function validMove(board: ChessBoard, team: TeamName, move: ChessMove): boolean {
	const fromCell = board[move.from.row][move.from.col];
	const toCell = board[move.to.row][move.to.col];

	// There are no pieces in the from
	if (fromCell == null) {
		return false;
	}

	// The piece in the from is the other team's
	if (fromCell.team != team) {
		return false;
	}

	// The piece in the to is in this team
	if (toCell != null && toCell.team == team) {
		return false;
	}

	const piece = fromCell.piece;
	if (piece == ChessPiece.PAWN) {
		return validPawnMove(board, team, move);
	} else if (piece == ChessPiece.KNIGHT) {
		return validKnightMove(move);
	} else if (piece == ChessPiece.BISHOP) {
		return validBishopMove(board, team, move);
	} else if (piece == ChessPiece.ROOK) {
		return validRookMove(board, team, move);
	} else if (piece == ChessPiece.QUEEN) {
		return validQueenMove(board, team, move);
	} else if (piece == ChessPiece.KING) {
		return validKingMove(move);
	}

	return true;
}

function validPawnMove(board: ChessBoard, team: TeamName, move: ChessMove): boolean {
	return true;
}

function validKnightMove(move: ChessMove): boolean {
	const rowChange = Math.abs(move.from.row - move.to.row);
	const colChange = Math.abs(move.from.col - move.to.col);

	if (rowChange == 1 && colChange == 2) {
		return true;
	} else if (rowChange == 2 && colChange == 1) {
		return true;
	} else {
		return false;
	}
}

function validBishopMove(board: ChessBoard, team: TeamName, move: ChessMove): boolean {
	return true;
}

function validRookMove(board: ChessBoard, team: TeamName, move: ChessMove): boolean {
	return true;
}

function validQueenMove(board: ChessBoard, team: TeamName, move: ChessMove): boolean {
	return true;
}

function validKingMove(move: ChessMove): boolean {
	const rowChange = Math.abs(move.from.row - move.to.row);
	const colChange = Math.abs(move.from.col - move.to.col);

	if (rowChange <= 1 && colChange <= 1) {
		return true;
	} else {
		return false;
	}
}
