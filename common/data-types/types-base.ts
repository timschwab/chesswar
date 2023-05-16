export type ChesswarId = string;

export enum ChessPiece {
	KING = "king",
	QUEEN = "queen",
	ROOK = "rook",
	BISHOP = "bishop",
	KNIGHT = "knight",
	PAWN = "pawn"
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

	GATHER_INTEL = "record-intel",
	REPORT_INTEL = "report-intel"
}
