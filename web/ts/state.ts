import { ChessBoard, ChessSquare } from "../../common/data-types/chess.ts";
import { ChesswarId, PlayerAction, PlayerRole, TeamName, Victory } from "../../common/data-types/base.ts";
import { BriefingBundle, BriefingName } from "../../common/data-types/facility.ts";
import { ServerStats } from "../../common/data-types/server.ts";
import { CarryLoad, CarryLoadType } from "../../common/data-types/carryLoad.ts";
import { DiffStore } from "./diffStore.ts";
import { Rect } from "../../common/shapes/Rect.ts";
import { Circle } from "../../common/shapes/Circle.ts";

export interface ClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	actionOption: PlayerAction | null,
	position: DiffStore<Circle>,
	deathCounter: number
}

export type PlayerMap = Map<ChesswarId, ClientPlayer>;

export interface GeneralState {
	selectedButton: BriefingName | null,
	selectedFrom: ChessSquare | null
}

export interface Stats {
	show: boolean,
	server: ServerStats,
	prevPingDelayMs: number
	thisPingSend: number,
	thisPongRecv: number,
	nextPingCount: number
}

const teamBoard = new DiffStore<ChessBoard | null>();

export interface UnsafeState {
	count: number,
	screen: Rect | undefined,
	selfId: ChesswarId | undefined,
	self: ClientPlayer | undefined,
	teamBoard: DiffStore<ChessBoard | null>,
	playerMap: PlayerMap,
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
	teamBoard: DiffStore<ChessBoard>,
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
	teamBoard,
	playerMap: new Map<ChesswarId, ClientPlayer>(),
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

	if (maybeSafeState.teamBoard.value() == null) {
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
