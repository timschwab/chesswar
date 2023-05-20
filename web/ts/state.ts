import { BriefingBundle, BriefingName, ChessBoard, ChessSquare, ChesswarId } from "../../common/data-types/types-base.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";

export interface Screen {
	width: number,
	height: number
}

export type PlayerMap = Map<ChesswarId, ClientPlayer>;

export interface GeneralState {
	selectedButton: BriefingName | null,
	selectedFrom: ChessSquare | null
}

export interface UnsafeState {
	screen: Screen | undefined,
	selfId: ChesswarId | undefined,
	self: ClientPlayer | undefined,
	teamBoard: ChessBoard | undefined,
	playerMap: PlayerMap | undefined,
	briefings: BriefingBundle | undefined,
	general: GeneralState
}

export interface SafeState {
	screen: Screen,
	selfId: ChesswarId,
	self: ClientPlayer,
	teamBoard: ChessBoard,
	playerMap: PlayerMap,
	briefings: BriefingBundle
	general: GeneralState
}

const state: UnsafeState = {
	screen: undefined,
	selfId: undefined,
	self: undefined,
	teamBoard: undefined,
	playerMap: undefined,
	briefings: undefined,
	general: {
		selectedButton: null,
		selectedFrom: null
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
