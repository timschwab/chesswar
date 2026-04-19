import { assertNever } from "../Preconditions.ts";
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

export interface Chess960Configuration {
	bishop1: number,
	bishop2: number,

	queen: number,
	knight1: number,
	knight2: number,

	rook1: number,
	king: number,
	rook2: number
}

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
	SOUTH = "south"
}

export interface ChessMove {
	team: TeamName,
	from: ChessCoordinate,
	to: ChessCoordinate
}

export function teamPerspective(team: TeamName): ChessPerspective {
	switch (team) {
		case TeamName.BLUE:
			return ChessPerspective.NORTH;
		case TeamName.RED:
			return ChessPerspective.SOUTH;
		default:
			assertNever(team);
	}
}

export function applyPerspective(coordinate: ChessCoordinate, perspective: ChessPerspective): ChessCoordinate {
	switch (perspective) {
		case ChessPerspective.NORTH:
			return {
				rank: 7-coordinate.rank,
				file: 7-coordinate.file
			}
		case ChessPerspective.SOUTH:
			return coordinate;
		default:
			assertNever(perspective);
	}
}
