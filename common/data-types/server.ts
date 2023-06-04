import { BriefingName } from "./base.ts";
import { ChessBoard, ChessMove } from "./chess.ts";

export type MovementState = {
	left: boolean,
	right: boolean,
	up: boolean,
	down: boolean
}

export interface ServerStats {
	tickMs: number,
}

export interface BriefingBundle {
	[BriefingName.ONE]: ChessMove | null,
	[BriefingName.TWO]: ChessMove | null,
	[BriefingName.THREE]: ChessMove | null
}

export enum CarryLoadType {
	EMPTY = "empty",
	MOVE = "move",
	BOARD = "board"
}

interface EmptyCarryLoad {
	type: CarryLoadType.EMPTY,
	load: null
}

interface ChessMoveCarryLoad {
	type: CarryLoadType.MOVE,
	load: ChessMove
}

interface ChessBoardCarryLoad {
	type: CarryLoadType.BOARD,
	load: ChessBoard
}

export type CarryLoad = EmptyCarryLoad | ChessMoveCarryLoad | ChessBoardCarryLoad;
