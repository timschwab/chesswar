import { ChesswarId, Victory } from "../../../common/data-types/base.ts";
import { EMPTY_CARRY_LOAD } from "../../../common/data-types/carryLoad.ts";
import { ChessSquare } from "../../../common/data-types/chess.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { CarryingMessagePayload, TeamMessagePayload } from "../../../common/message-types/server.ts";
import { ClientPlayer } from "./ClientPlayer.ts";
import { GameStats } from "./GameStats.ts";

interface UnsafeState {
	selfId: ChesswarId | null,
	selfPlayer: ClientPlayer | null,
	players: ClientPlayer[],
	team: TeamMessagePayload | null,
	ui: {
		carrying: CarryingMessagePayload,
		general: {
			selectedButton: BriefingName | null,
			selectedFrom: ChessSquare | null
		},
		stats: {
			showing: boolean,
			data: GameStats
		}
	},
	victory: Victory,
	newGameCounter: number
}

export interface SafeState {
	selfId: ChesswarId,
	selfPlayer: ClientPlayer,
	players: ClientPlayer[],
	team: TeamMessagePayload,
	ui: {
		carrying: CarryingMessagePayload,
		general: {
			selectedButton: BriefingName | null,
			selectedFrom: ChessSquare | null
		},
		stats: {
			showing: boolean,
			data: GameStats
		}
	},
	victory: Victory,
	newGameCounter: number
}

export function isSafeState(state: UnsafeState): state is SafeState {
	if (state.selfId === null) {
		return false;
	}

	if (state.selfPlayer === null) {
		return false;
	}

	if (state.team === null) {
		return false;
	}

	return true;
}

export const state: UnsafeState = {
	selfId: null,
	selfPlayer: null,
	players: [],
	team: null,
	ui: {
		carrying: EMPTY_CARRY_LOAD,
		general: {
			selectedButton: null,
			selectedFrom: null
		},
		stats: {
			showing: false,
			data: GameStats.Zero
		}
	},
	victory: null,
	newGameCounter: Infinity
};
