import { TeamName } from "../common/data-types/base.ts";
import { ChessBoard, ChessMove, ChessPiece, ChessRow, ChessCoordinate, SquareColor, ChessSquare, Chess960Configuration } from "../common/data-types/chess.ts";
import { kingsKillKings } from "../common/options.ts";
import { randomPop } from "../common/random.ts";

export function makeMove(board: ChessBoard, move: ChessMove): void {
	if (validMove(board, move)) {
		// Move the piece
		board[move.to.rank][move.to.file].contents = board[move.from.rank][move.from.file].contents;
		board[move.from.rank][move.from.file].contents = null;

		// Special case of turning a pawn into a queen
		pawnToQueen(board, move.to);
	}
}

function validMove(board: ChessBoard, move: ChessMove): boolean {
	const fromCell = board[move.from.rank][move.from.file].contents;
	const toCell = board[move.to.rank][move.to.file].contents;

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
	const rowChange = move.to.rank - move.from.rank;
	const colChange = move.to.file - move.from.file;

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
		if (board[move.to.rank][move.to.file].contents == null) {
			return true;
		} else {
			return false;
		}
	}

	// Check for starting moves
	if (move.from.rank == teamValue.startRow && colChange == 0 && Math.abs(rowChange) == 2) {
		if (board[move.from.rank+teamValue.direction][move.from.file].contents != null) {
			return false;
		} else if (board[move.to.rank][move.to.file].contents != null) {
			return false;
		} else {
			return true;
		}
	}

	// Check for attacking moves
	if (Math.abs(colChange) == 1 && Math.abs(rowChange) == 1) {
		if (board[move.to.rank][move.to.file].contents == null) {
			return false;
		} else if (board[move.to.rank][move.to.file].contents?.team == move.team) {
			return false;
		} else {
			return true;
		}
	}

	// For ChessWar, we don't check for en passant or castling

	return false;
}

function validKnightMove(move: ChessMove): boolean {
	const rowChange = Math.abs(move.from.rank - move.to.rank);
	const colChange = Math.abs(move.from.file - move.to.file);

	if (rowChange == 1 && colChange == 2) {
		return true;
	} else if (rowChange == 2 && colChange == 1) {
		return true;
	} else {
		return false;
	}
}

function validBishopMove(board: ChessBoard, move: ChessMove): boolean {
	const rowChange = Math.abs(move.from.rank - move.to.rank);
	const colChange = Math.abs(move.from.file - move.to.file);

	// Make sure it is diagonal
	if (rowChange != colChange) {
		return false;
	}

	// Make sure there are no pieces in the way
	return !middlePiecesExist(board, move);
}

function validRookMove(board: ChessBoard, move: ChessMove): boolean {
	const rowMove = Math.sign(move.from.rank - move.to.rank);
	const colMove = Math.sign(move.from.file - move.to.file);

	// Make sure it is in a line
	if (rowMove != 0 && colMove != 0) {
		return false;
	}

	// Make sure there are no pieces in the way
	return !middlePiecesExist(board, move);
}

function middlePiecesExist(board: ChessBoard, move: ChessMove): boolean {
	const rowMove = Math.sign(move.to.rank - move.from.rank);
	const colMove = Math.sign(move.to.file - move.from.file);

	let checkSquare = {
		row: move.from.rank + rowMove,
		col: move.from.file + colMove
	};
	while (checkSquare.row != move.to.rank || checkSquare.col != move.to.file) {
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
		if (board[move.to.rank][move.to.rank].contents?.piece == ChessPiece.KING) {
			return false;
		}
	}

	const rowChange = Math.abs(move.from.rank - move.to.rank);
	const colChange = Math.abs(move.from.file - move.to.file);

	// For ChessWar, we don't check for en passant or castling

	if (rowChange <= 1 && colChange <= 1) {
		return true;
	} else {
		return false;
	}
}

function pawnToQueen(board: ChessBoard, square: ChessCoordinate) {
	const squareState = board[square.rank][square.file].contents;
	if (squareState?.piece == ChessPiece.PAWN && (square.rank == 0 || square.rank == 7)) {
		squareState.piece = ChessPiece.QUEEN;
	}
}

export function newChess960Configuration(): Chess960Configuration {
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

	return {bishop1, bishop2, queen, knight1, knight2, rook1, king, rook2};
}

// Just having fun trying to enforce correctness via the type system. Probably objectively dumb.
function selectPiece(positions: Chess960Configuration, file: number): ChessPiece {
	switch (file) {
		case positions.bishop1: return ChessPiece.BISHOP;
		case positions.bishop2: return ChessPiece.BISHOP;
		case positions.queen:   return ChessPiece.QUEEN;
		case positions.knight1: return ChessPiece.KNIGHT;
		case positions.knight2: return ChessPiece.KNIGHT;
		case positions.rook1:   return ChessPiece.ROOK;
		case positions.king:    return ChessPiece.KING;
		case positions.rook2:   return ChessPiece.ROOK;
		default: throw "Should never get here";
	}
}

export function newBoard(positions: Chess960Configuration): ChessBoard {
	const row0 = newBackRow(positions, TeamName.BLUE);
	const row1 = newPawnRow(TeamName.BLUE);
	const row2 = newEmptyRow(2);
	const row3 = newEmptyRow(3);
	const row4 = newEmptyRow(4);
	const row5 = newEmptyRow(5);
	const row6 = newPawnRow(TeamName.RED);
	const row7 = newBackRow(positions, TeamName.RED);

	return [row0, row1, row2, row3, row4, row5, row6, row7];
}

function newBackRow(positions: Chess960Configuration, team: TeamName): ChessRow {
	const rank = team === TeamName.BLUE ? 0 : 7;
	const result = newEmptyRow(rank);

	for (let i = 0 ; i < 8 ; i++) {
		result[i].contents = {
			team,
			piece: selectPiece(positions, i)
		};
	}
	
	return result;
}

function newPawnRow(team: TeamName): ChessRow {
	const rank = team === TeamName.BLUE ? 1 : 6;
	const result = newEmptyRow(rank);

	for (let i = 0 ; i < 8 ; i++) {
		result[i].contents = {
			team,
			piece: ChessPiece.PAWN
		};
	}
	
	return result;
}

function newEmptyRow(rank: number): ChessRow {
	return [
		newEmptySquare(rank, 0), newEmptySquare(rank, 1),
		newEmptySquare(rank, 2), newEmptySquare(rank, 3),
		newEmptySquare(rank, 4), newEmptySquare(rank, 5),
		newEmptySquare(rank, 6), newEmptySquare(rank, 7)
	];
}

function newEmptySquare(rank: number, file: number): ChessSquare {
	const color = (rank+file) % 2 === 0 ? SquareColor.LIGHT : SquareColor.DARK;

	return {
		coordinate: {
			rank: rank,
			file: file
		},
		color: color,
		contents: null
	};
}
