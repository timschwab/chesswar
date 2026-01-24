import { Optional } from "../../../common/data-structures/Optional.ts";
import { Victory } from "../../../common/data-types/base.ts";
import { EMPTY_CARRY_LOAD } from "../../../common/data-types/carryLoad.ts";
import { ChessCoordinate } from "../../../common/data-types/chess.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { CarryingMessagePayload, TeamMessagePayload } from "../../../common/message-types/server.ts";
import { ClientPlayer } from "./ClientPlayer.ts";

export class ChesswarState {
	private selfId: Optional<string> = Optional.empty();
	private selfPlayer: Optional<ClientPlayer> = Optional.empty();
	private allPlayers: ClientPlayer[] = [];

	private teamInfo: Optional<TeamMessagePayload> = Optional.empty();
	private carrying: CarryingMessagePayload = EMPTY_CARRY_LOAD;
	private ui: ChesswarUiState = new ChesswarUiState();
	private victory: Victory = null;
	private newGameCounter: number = Infinity;

	setSelfId(id: string) {
		this.selfId = Optional.of(id);
	}

	getSelfPlayer() {
		return this.selfPlayer;
	}

	setStateFromServer(allPlayers: ClientPlayer[], victory: Victory, newGameCounter: number) {
		// Stop if we haven't received our id yet
		if (this.selfId.isEmpty()) {
			return;
		}

		const selfPlayer = allPlayers.find(player => player.id === this.selfId.get());
		if (!selfPlayer) {
			console.error("Could not find self player", {
				players: allPlayers,
				selfId: this.selfId.get()
			});
			return;
		}
	
		this.selfPlayer = Optional.of(selfPlayer);
		this.allPlayers = allPlayers;
		this.victory = victory;
		this.newGameCounter = newGameCounter;
	}

	getAllPlayers() {
		return this.allPlayers;
	}

	setTeamInfo(info: TeamMessagePayload) {
		this.teamInfo = Optional.of(info);
	}

	getTeamInfo() {
		return this.teamInfo;
	}

	setCarrying(payload: CarryingMessagePayload) {
		this.carrying = payload;
	}

	getCarrying() {
		return this.carrying;
	}

	getStatsShowing() {
		return this.ui.getStatsShowing();
	}

	toggleStatsShowing() {
		this.ui.toggleStatsShowing();
	}

	getGeneralSelectedButton() {
		return this.ui.getGeneralSelectedButton();
	}

	setGeneralSelectedButton(button: Optional<BriefingName>) {
		this.ui.setGeneralSelectedButton(button);
	}

	getGeneralSelectedFrom() {
		return this.ui.getGeneralSelectedFrom();
	}

	setGeneralSelectedFrom(from: Optional<ChessCoordinate>) {
		this.ui.setGeneralSelectedFrom(from);
	}
}

class ChesswarUiState {
	private generalSelectedButton: Optional<BriefingName> = Optional.empty();
	private generalSelectedFrom: Optional<ChessCoordinate> = Optional.empty();
	private statsShowing: boolean = false;

	getStatsShowing() {
		return this.statsShowing;
	}

	toggleStatsShowing() {
		this.statsShowing = !this.statsShowing;
	}

	getGeneralSelectedButton() {
		return this.generalSelectedButton;
	}

	setGeneralSelectedButton(button: Optional<BriefingName>) {
		this.generalSelectedButton = button;
	}

	getGeneralSelectedFrom() {
		return this.generalSelectedFrom;
	}

	setGeneralSelectedFrom(from: Optional<ChessCoordinate>) {
		this.generalSelectedFrom = from;
	}
}
