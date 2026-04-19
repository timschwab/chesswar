import { DeathCause, PlayerAction } from "../../../common/data-types/base.ts";
import { CarryingMessagePayload, PlayerInitMessagePayload, ServerMessage, ServerMessageTypes, StateMessagePayload, StatsMessagePayload, TeamMessagePayload } from "../../../common/message-types/server.ts";
import { assertNever } from "../../../common/Preconditions.ts";
import { ChesswarAudioPlayer } from "../audio/ChesswarAudioPlayer.ts";
import { deserializeClientPlayer } from "./ClientPlayer.ts";
import { PingManager } from "./PingManager.ts";
import { GameStats } from "./GameStats.ts";
import { ChesswarState } from "./ChesswarState.ts";

export class MessageHandler {
	private readonly state: ChesswarState;
	private readonly audioPlayer: ChesswarAudioPlayer;
	private readonly statsManager: GameStats;
	private readonly pingManager: PingManager;

	constructor(
			state: ChesswarState,
			audioPlayer: ChesswarAudioPlayer,
			statsManager: GameStats,
			pingManager: PingManager
	) {
		this.state = state;
		this.audioPlayer = audioPlayer;
		this.statsManager = statsManager;
		this.pingManager = pingManager;
	}

	receiveMessage(message: ServerMessage): void {
		if (message.type == ServerMessageTypes.PLAYER_INIT) {
			this.handlePlayerInit(message.payload);
		} else if (message.type == ServerMessageTypes.STATE) {
			this.handleState(message.payload);
		} else if (message.type == ServerMessageTypes.TEAM) {
			this.handleTeam(message.payload);
		} else if (message.type == ServerMessageTypes.ACTION_COMPLETED) {
			this.handleCompletedAction(message.payload);
		} else if (message.type == ServerMessageTypes.CARRYING) {
			this.handleCarrying(message.payload);
		} else if (message.type == ServerMessageTypes.DEATH) {
			this.handleDeath(message.payload);
		} else if (message.type == ServerMessageTypes.PONG) {
			this.handlePong(message.payload);
		} else if (message.type == ServerMessageTypes.STATS) {
			this.handleServerStats(message.payload);
		} else {
			assertNever(message);
		}
	}

	private handlePlayerInit(payload: PlayerInitMessagePayload) {
		this.state.setSelfId(payload.id);
	}

	private handleState(payload: StateMessagePayload) {
		const deserialized = payload.players.map(deserializeClientPlayer);
		this.state.setStateFromServer(deserialized, payload.victory, payload.newGameCounter);
		this.statsManager.recordPlayersOnline(payload.players.length);
	}

	private handleTeam(payload: TeamMessagePayload) {
		this.state.setTeamInfo(payload);
	}

	private handleCompletedAction(payload: PlayerAction) {
		if (payload == PlayerAction.GRAB_ORDERS) {
			this.audioPlayer.grabOrders();
		} else if (payload == PlayerAction.COMPLETE_ORDERS) {
			this.audioPlayer.completeOrders();
		}
	}

	private handleCarrying(payload: CarryingMessagePayload) {
		this.state.setCarrying(payload);
	}
	
	private handleDeath(payload: DeathCause) {
		if (payload == DeathCause.MINEFIELD) {
			this.audioPlayer.death3();
		} else if (payload == DeathCause.TANK) {
			this.audioPlayer.death1();
		}
	}
	
	private handlePong(_payload: null) {
		this.pingManager.pong();
	}
	
	private handleServerStats(payload: StatsMessagePayload) {
		this.statsManager.recordServerStats(payload);
	}
}
