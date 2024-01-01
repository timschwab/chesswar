import { ChesswarId } from "../../../common/data-types/base.ts";
import { ChessSquare } from "../../../common/data-types/chess.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { ClientPlayer } from "./ClientPlayer.ts";

interface UnsafeState {
	selfId: ChesswarId | null,
	selfPlayer: ClientPlayer | null,
	general: {
		selectedButton: BriefingName | null,
		selectedFrom: ChessSquare | null
	}
}

export const state: UnsafeState = {
	selfId: null,
	selfPlayer: null,
	general: {
		selectedButton: null,
		selectedFrom: null
	}
};
