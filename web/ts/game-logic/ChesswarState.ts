import { Optional } from "../../../common/data-structures/Optional.ts";
import { Victory } from "../../../common/data-types/base.ts";
import { EMPTY_CARRY_LOAD } from "../../../common/data-types/carryLoad.ts";
import { ChessSquare } from "../../../common/data-types/chess.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { CarryingMessagePayload, TeamMessagePayload } from "../../../common/message-types/server.ts";
import { ClientPlayer } from "./ClientPlayer.ts";

export class ChesswarState {
	private selfId: Optional<string> = Optional.empty();
	private selfPlayer: Optional<ClientPlayer> = Optional.empty();
	private allPlayers: ClientPlayer[] = [];

	private teamInfo: Optional<TeamMessagePayload> = Optional.empty();
	private ui: ChesswarUiState = new ChesswarUiState();
	private victory: Victory = null;
	private newGameCounter: number = Infinity;

	getSelfPlayer() {
		return this.selfPlayer;
	}

	getAllPlayers() {
		return this.allPlayers;
	}

	getStatsShowing() {
		return this.ui.getStatsShowing();
	}
}

class ChesswarUiState {
	private carrying: CarryingMessagePayload = EMPTY_CARRY_LOAD;
	private generalSelectedButton: Optional<BriefingName> = Optional.empty();
	private generalSelectedFrom: Optional<ChessSquare> = Optional.empty();
	private statsShowing: boolean = false;

	getStatsShowing() {
		return this.statsShowing;
	}
}
