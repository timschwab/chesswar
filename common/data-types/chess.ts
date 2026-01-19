import { TeamName } from "./base.ts";

export enum SquareColor {
	LIGHT = "light",
	DARK = "dark"
}

export enum ChessPiece {
	KING = "king",
	QUEEN = "queen",
	ROOK = "rook",
	BISHOP = "bishop",
	KNIGHT = "knight",
	PAWN = "pawn"
}

export type Chess960Configuration = [
	ChessPiece, ChessPiece, ChessPiece, ChessPiece, ChessPiece, ChessPiece, ChessPiece, ChessPiece
];

export interface ChessOwnedPiece {
	team: TeamName,
	piece: ChessPiece
}

export type ChessSquareContents = ChessOwnedPiece | null;

export interface ChessCoordinate {
	rank: number,
	file: number
}

export interface ChessSquare {
	coordinate: ChessCoordinate,
	color: SquareColor,
	contents: ChessSquareContents
}

export type ChessRow = [ChessSquare, ChessSquare, ChessSquare, ChessSquare, ChessSquare, ChessSquare, ChessSquare, ChessSquare]; // tuple of 8
export type ChessBoard = [ChessRow, ChessRow, ChessRow, ChessRow, ChessRow, ChessRow, ChessRow, ChessRow]; // tuple of 8

export enum ChessPerspective {
	NORTH = "north",
	EAST = "east",
	SOUTH = "south",
	WEST = "west"
}

export interface ChessMove {
	team: TeamName,
	from: ChessCoordinate,
	to: ChessCoordinate
}
