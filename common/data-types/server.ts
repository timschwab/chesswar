import { BriefingName } from "./base.ts";
import { ChessMove } from "./chess.ts";

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
