import { ChessSquare } from "../../common/data-types/chess.ts";
import { ChesswarId, PlayerAction, PlayerRole, TeamName } from "../../common/data-types/base.ts";
import { BriefingName } from "../../common/data-types/facility.ts";
import { ServerStats } from "../../common/data-types/server.ts";
import { Circle } from "../../common/shapes/Circle.ts";
import { CWScene } from "./scene/CWScene.ts";
import { DiffStore } from "../../common/data-structures/diffStore.ts";

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

// const teamBoard = new DiffStore<ChessBoard>();

export interface UnsafeState {
	count: number,
	scene: CWScene | null,

	// selfId: ChesswarId | null,
	// self: ClientPlayer | null,

	// teamBoard: DiffStore<ChessBoard>,
	// playerMap: PlayerMap,
	// briefings: BriefingBundle | null,
	// enemyBriefings: BriefingBundle | null,
	// carrying: CarryLoad
	// general: GeneralState,
	// victory: Victory,
	// newGameCounter: number,
	// stats: Stats
}

export interface SafeState {
	count: number,
	scene: CWScene

	// screen: Rect,
	// selfId: ChesswarId,
	// self: ClientPlayer,
	// teamBoard: DiffStore<ChessBoard>,
	// playerMap: PlayerMap,
	// removedPlayers: Queue<ClientPlayer>,
	// briefings: BriefingBundle,
	// enemyBriefings: BriefingBundle,
	// carrying: CarryLoad,
	// general: GeneralState,
	// victory: Victory,
	// newGameCounter: number,
	// stats: Stats
}

const state: UnsafeState = {
	count: 0,
	scene: null

	// screen: undefined,
	// selfId: undefined,
	// self: undefined,
	// teamBoard,
	// playerMap: new Map<ChesswarId, ClientPlayer>(),
	// removedPlayers: new Queue<ClientPlayer>(),
	// briefings: undefined,
	// enemyBriefings: undefined,
	// carrying: {
	// 	type: CarryLoadType.EMPTY,
	// 	load: null
	// },
	// general: {
	// 	selectedButton: null,
	// 	selectedFrom: null
	// },
	// victory: null,
	// newGameCounter: Infinity,
	// stats: {
	// 	show: false,
	// 	server: {
	// 		tickMs: 0
	// 	},
	// 	prevPingDelayMs: 0,
	// 	thisPingSend: 0,
	// 	thisPongRecv: 0,
	// 	nextPingCount: 120
	// }
};

export function isSafeState(maybeSafeState: UnsafeState): maybeSafeState is SafeState {
	if (maybeSafeState.scene == null) {
		return false;
	}

	return true;
}

export default state;
