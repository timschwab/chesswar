import { DeathCause, PlayerAction, PlayerRole } from "../../../common/data-types/base.ts";
import {
	CarryingMessagePayload,
	PlayerInitMessagePayload,
	ServerMessage,
	ServerMessageTypes,
	StateMessagePayload,
	StatsMessagePayload,
	TeamMessagePayload
} from "../../../common/message-types/server.ts";
import { assertNever } from "../../../common/Preconditions.ts";
import { ChesswarAudioPlayer } from "../audio/ChesswarAudioPlayer.ts";
import { ClientPlayer, deserializeClientPlayer } from "./ClientPlayer.ts";
import { reportPong } from "./pingManager.ts";
import { state } from "./state.ts";
import { recordPlayersOnline, recordServerStats } from "./statsManager.ts";

const audioPlayer = new ChesswarAudioPlayer();

export function receiveMessage(message: ServerMessage): void {
	if (message.type == ServerMessageTypes.PLAYER_INIT) {
		handlePlayerInit(message.payload);
	} else if (message.type == ServerMessageTypes.STATE) {
		handleState(message.payload);
	} else if (message.type == ServerMessageTypes.TEAM) {
		handleTeam(message.payload);
	} else if (message.type == ServerMessageTypes.ACTION_COMPLETED) {
		handleCompletedAction(message.payload);
	} else if (message.type == ServerMessageTypes.CARRYING) {
		handleCarrying(message.payload);
	} else if (message.type == ServerMessageTypes.DEATH) {
		handleDeath(message.payload);
	} else if (message.type == ServerMessageTypes.PONG) {
		handlePong(message.payload);
	} else if (message.type == ServerMessageTypes.STATS) {
		handleServerStats(message.payload);
	} else {
		assertNever(message);
	}
}

function handlePlayerInit(payload: PlayerInitMessagePayload) {
	state.selfId = payload.id;
}

function handleState(payload: StateMessagePayload) {
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

	recordPlayersOnline(payload.players.length);
}

function shouldClamp(selfPlayer: ClientPlayer, otherPlayer: ClientPlayer): boolean {
	if (selfPlayer.role !== PlayerRole.TANK) {
		return false;
	}

	if (selfPlayer.team === otherPlayer.team) {
		return false;
	}

	if (otherPlayer.role == PlayerRole.GENERAL) {
		return false;
	} else if (otherPlayer.role == PlayerRole.SOLDIER) {
		return true;
	} else if (otherPlayer.role == PlayerRole.TANK) {
		return true;
	} else if (otherPlayer.role == PlayerRole.OPERATIVE) {
		return false;
	}

	assertNever(otherPlayer.role);
	return false;
}

function handleTeam(payload: TeamMessagePayload) {
	state.team = payload;
}

function handleCompletedAction(payload: PlayerAction) {
	if (payload == PlayerAction.GRAB_ORDERS) {
		audioPlayer.grabOrders();
	} else if (payload == PlayerAction.COMPLETE_ORDERS) {
		audioPlayer.completeOrders();
	}
}

function handleCarrying(payload: CarryingMessagePayload) {
	state.ui.carrying = payload;
}

function handleDeath(payload: DeathCause) {
	if (payload == DeathCause.MINEFIELD) {
		audioPlayer.death3();
	} else if (payload == DeathCause.TANK) {
		audioPlayer.death1();
	}
}

function handlePong(_payload: null) {
	reportPong();
}

function handleServerStats(payload: StatsMessagePayload) {
	recordServerStats(payload);
}
