import { DeathCause, PlayerAction } from "../../../common/data-types/base.ts";
import { CarryingMessagePayload, PlayerInitMessagePayload, ServerMessage, ServerMessageTypes, StateMessagePayload, StatsMessagePayload, TeamMessagePayload } from "../../../common/message-types/server.ts";
import { assertNever } from "../../../common/Preconditions.ts";
import { ChesswarAudioPlayer } from "../audio/ChesswarAudioPlayer.ts";
import { deserializeClientPlayer } from "./ClientPlayer.ts";
import { PingManager } from "./PingManager.ts";
import { state } from "./state.ts";
import { ChesswarStats } from "./ChesswarStats.ts";

export class MessageHandler {
	private readonly audioPlayer: ChesswarAudioPlayer;
	private readonly statsManager: ChesswarStats;
	private readonly pingManager: PingManager;

	constructor(audioPlayer: ChesswarAudioPlayer, statsManager: ChesswarStats, pingManager: PingManager) {
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
		state.selfId = payload.id;
	}

	private handleState(payload: StateMessagePayload) {
		const deserialized = payload.players.map(deserializeClientPlayer);
	
		const selfPlayer = deserialized.find(player => player.id === state.selfId);
		if (!selfPlayer) {
			console.error("Could not find self player", {
				players: deserialized,
				selfId: state.selfId
			});
			return;
		}
	
		state.selfPlayer = selfPlayer;
		state.players = deserialized;
		state.victory = payload.victory;
		state.newGameCounter = payload.newGameCounter;
	
		this.statsManager.recordPlayersOnline(payload.players.length);
	}

	private handleTeam(payload: TeamMessagePayload) {
		state.team = payload;
	}

	private handleCompletedAction(payload: PlayerAction) {
		if (payload == PlayerAction.GRAB_ORDERS) {
			this.audioPlayer.grabOrders();
		} else if (payload == PlayerAction.COMPLETE_ORDERS) {
			this.audioPlayer.completeOrders();
		}
	}

	private handleCarrying(payload: CarryingMessagePayload) {
		state.ui.carrying = payload;
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
