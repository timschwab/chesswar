import { ClientPlayer } from "../../common/data-types/client.ts";
import { ChessBoard, ChessSquare } from "../../common/data-types/chess.ts";
import { ChesswarId, Victory } from "../../common/data-types/base.ts";
import { BriefingBundle, BriefingName } from "../../common/data-types/facility.ts";
import { ServerStats } from "../../common/data-types/server.ts";
import { Rect } from "../../common/shapes/types.ts";
import { CarryLoad, CarryLoadType } from "../../common/data-types/carryLoad.ts";

export type PlayerMap = Map<ChesswarId, ClientPlayer>;

export interface GeneralState {
	selectedButton: BriefingName | null,
	selectedFrom: ChessSquare | null
}

export interface Stats {
	show: boolean,
	server: ServerStats,
	clientRenderMs: number,
	prevPingDelayMs: number
	thisPingSend: number,
	thisPongRecv: number,
	nextPingCount: number
}

export interface UnsafeState {
	count: number,
	screen: Rect | undefined,
	selfId: ChesswarId | undefined,
	self: ClientPlayer | undefined,
	teamBoard: ChessBoard | undefined,
	playerMap: PlayerMap | undefined,
	briefings: BriefingBundle | undefined,
	enemyBriefings: BriefingBundle | undefined,
	carrying: CarryLoad
	general: GeneralState,
	victory: Victory,
	newGameCounter: number,
	stats: Stats
}

export interface SafeState {
	count: number,
	screen: Rect,
	selfId: ChesswarId,
	self: ClientPlayer,
	teamBoard: ChessBoard,
	playerMap: PlayerMap,
	briefings: BriefingBundle,
	enemyBriefings: BriefingBundle,
	carrying: CarryLoad,
	general: GeneralState,
	victory: Victory,
	newGameCounter: number,
	stats: Stats
}

const state: UnsafeState = {
	count: 0,
	screen: undefined,
	selfId: undefined,
	self: undefined,
	teamBoard: undefined,
	playerMap: undefined,
	briefings: undefined,
	enemyBriefings: undefined,
	carrying: {
		type: CarryLoadType.EMPTY,
		load: null
	},
	general: {
		selectedButton: null,
		selectedFrom: null
	},
	victory: null,
	newGameCounter: Infinity,
	stats: {
		show: false,
		server: {
			tickMs: 0
		},
		clientRenderMs: 0,
		prevPingDelayMs: 0,
		thisPingSend: 0,
		thisPongRecv: 0,
		nextPingCount: 120
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

	if (!maybeSafeState.enemyBriefings) {
		return false;
	}

	return true;
}

export default state;
