import { ChessBoard, ChessMove, ChessPiece, ChessSquare, ChessSquareState, TeamName } from "../common/data-types/types-base.ts";

export function makeMove(board: ChessBoard, team: TeamName, move: ChessMove): void {
	if (validMove(board, team, move)) {
		// Move the piece
		board[move.to.row][move.to.col] = board[move.from.row][move.from.col];
		board[move.from.row][move.from.col] = null;

		// Special case of turning a pawn into a queen
		pawnToQueen(board, move.to);
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
		return validBishopMove(board, move);
	} else if (piece == ChessPiece.ROOK) {
		return validRookMove(board, move);
	} else if (piece == ChessPiece.QUEEN) {
		return validQueenMove(board, move);
	} else if (piece == ChessPiece.KING) {
		return validKingMove(move);
	} else {
		return false;
	}
}

function validPawnMove(board: ChessBoard, team: TeamName, move: ChessMove): boolean {
	const rowChange = move.to.row - move.from.row;
	const colChange = move.to.col - move.from.col;

	const teamValues = {
		[TeamName.ALPHA]: {
			startRow: 1,
			direction: 1
		},
		[TeamName.BRAVO]: {
			startRow: 6,
			direction: -1
		}
	};
	const teamValue = teamValues[team];

	// Check that the direction is correct
	if (Math.sign(rowChange) != teamValue.direction) {
		return false;
	}

	// Check for normal moves
	if (colChange == 0 && Math.abs(rowChange) == 1) {
		if (board[move.to.row][move.to.col] == null) {
			return true;
		} else {
			return false;
		}
	}

	// Check for starting moves
	if (move.from.row == teamValue.startRow && colChange == 0 && Math.abs(rowChange) == 2) {
		if (board[move.from.row+teamValue.direction][move.from.col] != null) {
			return false;
		} else if (board[move.to.row][move.to.col] != null) {
			return false;
		} else {
			return true;
		}
	}

	// Check for attacking moves
	if (Math.abs(colChange) == 1 && Math.abs(rowChange) == 1) {
		if (board[move.to.row][move.to.col] == null) {
			return false;
		} else if (board[move.to.row][move.to.col]?.team == team) {
			return false;
		} else {
			return true;
		}
	}

	// For Chesswar, we don't check for en passant

	return false;
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

function validBishopMove(board: ChessBoard, move: ChessMove): boolean {
	const rowChange = Math.abs(move.from.row - move.to.row);
	const colChange = Math.abs(move.from.col - move.to.col);

	// Make sure it is diagonal
	if (rowChange != colChange) {
		return false;
	}

	// Make sure there are no pieces in the way
	return !middlePiecesExist(board, move);
}

function validRookMove(board: ChessBoard, move: ChessMove): boolean {
	const rowMove = Math.sign(move.from.row - move.to.row);
	const colMove = Math.sign(move.from.col - move.to.col);

	// Make sure it is in a line
	if (rowMove != 0 && colMove != 0) {
		return false;
	}

	// Make sure there are no pieces in the way
	return !middlePiecesExist(board, move);
}

function middlePiecesExist(board: ChessBoard, move: ChessMove): boolean {
	const rowMove = Math.sign(move.to.row - move.from.row);
	const colMove = Math.sign(move.to.col - move.from.col);

	let checkSquare = {
		row: move.from.row + rowMove,
		col: move.from.col + colMove
	};
	while (checkSquare.row != move.to.row || checkSquare.col != move.to.col) {
		if (board[checkSquare.row][checkSquare.col] != null) {
			return true;
		}

		checkSquare = {
			row: checkSquare.row + rowMove,
			col: checkSquare.col + colMove
		};
	}

	return false;
}

function validQueenMove(board: ChessBoard, move: ChessMove): boolean {
	return validBishopMove(board, move) || validRookMove(board, move);
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

function pawnToQueen(board: ChessBoard, square: ChessSquare) {
	const squareState = board[square.row][square.col] as ChessSquareState;
	if (squareState.piece == ChessPiece.PAWN && (square.row == 0 || square.row == 7)) {
		squareState.piece = ChessPiece.QUEEN;
	}
}
