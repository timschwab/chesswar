import { ChessMove } from "./chess.ts";

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

export function emptyBriefingBundle(): BriefingBundle {
	return {
		[BriefingName.ONE]:  null,
		[BriefingName.TWO]: null,
		[BriefingName.THREE]: null
	};
}
