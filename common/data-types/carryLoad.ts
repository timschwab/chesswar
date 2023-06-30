import { ChessBoard, ChessMove } from "./chess.ts";
import { BriefingBundle } from "./facility.ts";

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