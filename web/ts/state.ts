import { ChesswarId } from "../../common/data-types/types-base.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";

export interface Screen {
	width: number,
	height: number
}

export type PlayerMap = Map<ChesswarId, ClientPlayer>;

export interface UnsafeState {
	screen: Screen | undefined,
	self: ChesswarId | undefined,
	playerMap: PlayerMap | undefined
}

export interface SafeState {
	screen: Screen,
	self: ChesswarId,
	playerMap: PlayerMap
}

const state: UnsafeState = {
	screen: undefined,
	self: undefined,
	playerMap: undefined
};

export function isSafeState(maybeSafeState: UnsafeState): maybeSafeState is SafeState {
	if (!maybeSafeState.screen) {
		return false;
	}

	if (!maybeSafeState.self) {
		return false;
	}

	if (!maybeSafeState.playerMap) {
		return false;
	}

	return true;
}

export default state;