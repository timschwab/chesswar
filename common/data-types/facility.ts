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

export function briefingBundleMoveList(bundle: BriefingBundle): ChessMove[] {
	const moves = [];

	if (bundle[BriefingName.ONE]) {
		moves.push(bundle[BriefingName.ONE]);
	}
	if (bundle[BriefingName.TWO]) {
		moves.push(bundle[BriefingName.TWO]);
	}
	if (bundle[BriefingName.THREE]) {
		moves.push(bundle[BriefingName.THREE]);
	}

	return moves;
}
