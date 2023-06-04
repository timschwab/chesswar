import { BriefingName } from "./base.ts";
import { ChessBoard, ChessMove } from "./chess.ts";

export type MovementState = {
	left: boolean,
	right: boolean,
	up: boolean,
	down: boolean
}

export interface ServerStats {
	tickMs: number,
}

export interface BriefingBundle {
	[BriefingName.ONE]: ChessMove | null,
	[BriefingName.TWO]: ChessMove | null,
	[BriefingName.THREE]: ChessMove | null
}

export enum CarryLoadType {
	EMPTY = "empty",
	ORDERS = "orders",
	INTEL = "intel",
	ESPIONAGE = "espionage"
}

interface EmptyCarryLoad {
	type: CarryLoadType.EMPTY,
	load: null
}

interface OrdersCarryLoad {
	type: CarryLoadType.ORDERS,
	load: ChessMove
}

interface IntelCarryLoad {
	type: CarryLoadType.INTEL,
	load: ChessBoard
}

interface EspionageCarryLoad {
	type: CarryLoadType.ESPIONAGE,
	load: BriefingBundle
}

export type CarryLoad = EmptyCarryLoad | OrdersCarryLoad | IntelCarryLoad | EspionageCarryLoad;
