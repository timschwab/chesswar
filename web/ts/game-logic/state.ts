import { ChesswarId } from "../../../common/data-types/base.ts";
import { ChessSquare } from "../../../common/data-types/chess.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { ClientPlayer } from "./ClientPlayer.ts";

interface UnsafeState {
	selfId: ChesswarId | null,
	selfPlayer: ClientPlayer | null,
	players: ClientPlayer[],
	general: {
		selectedButton: BriefingName | null,
		selectedFrom: ChessSquare | null
	}
}

export interface SafeState {
	selfId: ChesswarId,
	selfPlayer: ClientPlayer,
	players: ClientPlayer[],
	general: {
		selectedButton: BriefingName | null,
		selectedFrom: ChessSquare | null
	}
}

export function isSafeState(state: UnsafeState): state is SafeState {
	if (state.selfId === null) {
		return false;
	}

	if (state.selfPlayer === null) {
		return false;
	}

	return true;
}

export const state: UnsafeState = {
	selfId: null,
	selfPlayer: null,
	players: [],
	general: {
		selectedButton: null,
		selectedFrom: null
	}
};
