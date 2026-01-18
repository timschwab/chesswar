import { TeamName } from "../common/data-types/base.ts";
import { ChessBoard, ChessMove, ChessPiece, ChessRow, ChessCoordinate, ChessSquareContents } from "../common/data-types/chess.ts";
import { kingsKillKings } from "../common/options.ts";
import { randomPop } from "../common/random.ts";

export function makeMove(board: ChessBoard, move: ChessMove): void {
	if (validMove(board, move)) {
		// Move the piece
		board[move.to.row][move.to.col] = board[move.from.row][move.from.col];
		board[move.from.row][move.from.col] = null;

		// Special case of turning a pawn into a queen
		pawnToQueen(board, move.to);
	}
}

function validMove(board: ChessBoard, move: ChessMove): boolean {
	const fromCell = board[move.from.row][move.from.col];
	const toCell = board[move.to.row][move.to.col];

	// There are no pieces in the from
	if (fromCell == null) {
		return false;
	}

	// The piece in the from is the other team's
	if (fromCell.team != move.team) {
		return false;
	}

	// The piece in the to is in this team
	if (toCell != null && toCell.team == move.team) {
		return false;
	}

	const piece = fromCell.piece;
	if (piece == ChessPiece.PAWN) {
		return validPawnMove(board, move);
	} else if (piece == ChessPiece.KNIGHT) {
		return validKnightMove(move);
	} else if (piece == ChessPiece.BISHOP) {
		return validBishopMove(board, move);
	} else if (piece == ChessPiece.ROOK) {
		return validRookMove(board, move);
	} else if (piece == ChessPiece.QUEEN) {
		return validQueenMove(board, move);
	} else if (piece == ChessPiece.KING) {
		return validKingMove(board, move);
	} else {
		return false;
	}
}

function validPawnMove(board: ChessBoard, move: ChessMove): boolean {
	const rowChange = move.to.row - move.from.row;
	const colChange = move.to.col - move.from.col;

	const teamValues = {
		[TeamName.BLUE]: {
			startRow: 1,
			direction: 1
		},
		[TeamName.RED]: {
			startRow: 6,
			direction: -1
		}
	};
	const teamValue = teamValues[move.team];

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
		} else if (board[move.to.row][move.to.col]?.team == move.team) {
			return false;
		} else {
			return true;
		}
	}

	// For ChessWar, we don't check for en passant or castling

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

function validKingMove(board: ChessBoard, move: ChessMove): boolean {
	// If kings can't kill kings, then don't
	if (!kingsKillKings) {
		if (board[move.to.row][move.to.col]?.piece == ChessPiece.KING) {
			return false;
		}
	}

	const rowChange = Math.abs(move.from.row - move.to.row);
	const colChange = Math.abs(move.from.col - move.to.col);

	// For ChessWar, we don't check for en passant or castling

	if (rowChange <= 1 && colChange <= 1) {
		return true;
	} else {
		return false;
	}
}

function pawnToQueen(board: ChessBoard, square: ChessCoordinate) {
	const squareState = board[square.row][square.col] as ChessSquareContents;
	if (squareState.piece == ChessPiece.PAWN && (square.row == 0 || square.row == 7)) {
		squareState.piece = ChessPiece.QUEEN;
	}
}

export function newBoard(): ChessBoard {
	// Compute the back rows for Chess960
	// Place bishops
	const evenPositions = [0, 2, 4, 6];
	const oddPositions = [1, 3, 5, 7];
	const bishop1 = randomPop(evenPositions);
	const bishop2 = randomPop(oddPositions);

	// Place queen + knights
	const remainingPositions = evenPositions.concat(oddPositions);
	const queen = randomPop(remainingPositions);
	const knight1 = randomPop(remainingPositions);
	const knight2 = randomPop(remainingPositions);

	// Place rook, king, rook
	remainingPositions.sort();
	const rook1 = remainingPositions[0];
	const king = remainingPositions[1];
	const rook2 = remainingPositions[2];

	// Create the rows
	const row1: ChessRow = [null, null, null, null, null, null, null, null];
	row1[bishop1] = {team: TeamName.BLUE, piece: ChessPiece.BISHOP};
	row1[bishop2] = {team: TeamName.BLUE, piece: ChessPiece.BISHOP};
	row1[queen]   = {team: TeamName.BLUE, piece: ChessPiece.QUEEN};
	row1[knight1] = {team: TeamName.BLUE, piece: ChessPiece.KNIGHT};
	row1[knight2] = {team: TeamName.BLUE, piece: ChessPiece.KNIGHT};
	row1[rook1]   = {team: TeamName.BLUE, piece: ChessPiece.ROOK};
	row1[king]    = {team: TeamName.BLUE, piece: ChessPiece.KING};
	row1[rook2]   = {team: TeamName.BLUE, piece: ChessPiece.ROOK};

	const row2: ChessRow = [
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN}
	];

	const row3: ChessRow = [null, null, null, null, null, null, null, null];
	const row4: ChessRow = [null, null, null, null, null, null, null, null];
	const row5: ChessRow = [null, null, null, null, null, null, null, null];
	const row6: ChessRow = [null, null, null, null, null, null, null, null];

	const row7: ChessRow = [
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN}
	];

	// Can't find an elegant typescript way of mapping from row1 sadly
	const row8: ChessRow = [null, null, null, null, null, null, null, null];
	row8[bishop1] = {team: TeamName.RED, piece: ChessPiece.BISHOP};
	row8[bishop2] = {team: TeamName.RED, piece: ChessPiece.BISHOP};
	row8[queen]   = {team: TeamName.RED, piece: ChessPiece.QUEEN};
	row8[knight1] = {team: TeamName.RED, piece: ChessPiece.KNIGHT};
	row8[knight2] = {team: TeamName.RED, piece: ChessPiece.KNIGHT};
	row8[rook1]   = {team: TeamName.RED, piece: ChessPiece.ROOK};
	row8[king]    = {team: TeamName.RED, piece: ChessPiece.KING};
	row8[rook2]   = {team: TeamName.RED, piece: ChessPiece.ROOK};

	return [row1, row2, row3, row4, row5, row6, row7, row8];
}
