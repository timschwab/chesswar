import { TeamName } from "./base.ts";

export enum ChessPiece {
	KING = "king",
	QUEEN = "queen",
	ROOK = "rook",
	BISHOP = "bishop",
	KNIGHT = "knight",
	PAWN = "pawn"
}

export interface ChessSquareState {
	piece: ChessPiece,
	team: TeamName
}

export type ChessCell = ChessSquareState | null;
export type ChessRow = [ChessCell, ChessCell, ChessCell, ChessCell, ChessCell, ChessCell, ChessCell, ChessCell]; // tuple of 8
export type ChessBoard = [ChessRow, ChessRow, ChessRow, ChessRow, ChessRow, ChessRow, ChessRow, ChessRow]; // tuple of 8

export interface ChessSquare {
	row: number,
	col: number
}

export interface ChessMove {
	team: TeamName,
	from: ChessSquare,
	to: ChessSquare
}