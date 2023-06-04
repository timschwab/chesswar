export type ChesswarId = string;

export enum BriefingName {
	ONE,
	TWO,
	THREE
}

export interface BriefingBundle {
	[BriefingName.ONE]: ChessMove | null,
	[BriefingName.TWO]: ChessMove | null,
	[BriefingName.THREE]: ChessMove | null
}

export enum TeamName {
	ALPHA = "alpha",
	BRAVO = "bravo"
}

export enum PlayerRole {
	GENERAL = "general",
	SOLDIER = "soldier",
	TANK = "tank",
	SPY = "spy"
}

export enum CommandAction {
	BECOME_GENERAL = "become-general",
	BECOME_SOLDIER = "become-soldier",
	BECOME_TANK = "become-tank",
	BECOME_SPY = "become-spy",

	GRAB_ORDERS = "grab-orders",
	COMPLETE_ORDERS = "complete-orders",

	GATHER_INTEL = "gather-intel",
	REPORT_INTEL = "report-intel"
}

export type Victory = null | TeamName | "tie";

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
	from: ChessSquare,
	to: ChessSquare
}
