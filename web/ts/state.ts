import { Rect } from "../../common/data-types/shapes.ts";
import { BriefingBundle, BriefingName, ChessBoard, ChessSquare, ChesswarId, Victory } from "../../common/data-types/types-base.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";

export type PlayerMap = Map<ChesswarId, ClientPlayer>;

export interface GeneralState {
	selectedButton: BriefingName | null,
	selectedFrom: ChessSquare | null
}

export interface Stats {
	clientRenderMs: number
}

export interface UnsafeState {
	renderCount: number,
	screen: Rect | undefined,
	selfId: ChesswarId | undefined,
	self: ClientPlayer | undefined,
	teamBoard: ChessBoard | undefined,
	playerMap: PlayerMap | undefined,
	briefings: BriefingBundle | undefined,
	general: GeneralState,
	victory: Victory,
	stats: Stats
}

export interface SafeState {
	renderCount: number,
	screen: Rect,
	selfId: ChesswarId,
	self: ClientPlayer,
	teamBoard: ChessBoard,
	playerMap: PlayerMap,
	briefings: BriefingBundle
	general: GeneralState,
	victory: Victory,
	stats: Stats
}

const state: UnsafeState = {
	renderCount: 0,
	screen: undefined,
	selfId: undefined,
	self: undefined,
	teamBoard: undefined,
	playerMap: undefined,
	briefings: undefined,
	general: {
		selectedButton: null,
		selectedFrom: null
	},
	victory: null,
	stats: {
		clientRenderMs: 0
	}
};

export function isSafeState(maybeSafeState: UnsafeState): maybeSafeState is SafeState {
	if (!maybeSafeState.screen) {
		return false;
	}

	if (!maybeSafeState.selfId) {
		return false;
	}

	if (!maybeSafeState.self) {
		return false;
	}

	if (!maybeSafeState.teamBoard) {
		return false;
	}

	if (!maybeSafeState.playerMap) {
		return false;
	}

	if (!maybeSafeState.briefings) {
		return false;
	}

	return true;
}

export default state;
