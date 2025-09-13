import { Victory } from "../../../common/data-types/base.ts";
import { EMPTY_CARRY_LOAD } from "../../../common/data-types/carryLoad.ts";
import { ChessSquare } from "../../../common/data-types/chess.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { CarryingMessagePayload, TeamMessagePayload } from "../../../common/message-types/server.ts";
import { ClientPlayer } from "./ClientPlayer.ts";

export class ChesswarState {
	private selfId: string | null = null;
	private selfPlayer: ClientPlayer | null = null;
	private allPlayers: ClientPlayer[] = [];

	private teamInfo: TeamMessagePayload | null = null;
	private ui: ChesswarUiState = new ChesswarUiState();
	private victory: Victory = null;
	private newGameCounter: number = Infinity;
}

class ChesswarUiState {
	private carrying: CarryingMessagePayload = EMPTY_CARRY_LOAD;
	private generalSelectedButton: BriefingName | null = null;
	private generalSelectedFrom: ChessSquare | null = null;
	private statsShowing: boolean = false;
}
