import { DeathCause, PlayerAction } from "../../common/data-types/base.ts";
import { CarryingMessagePayload, PlayerInitMessagePayload, ServerMessage, ServerMessageTypes, StateMessagePayload, StatsMessagePayload, TeamMessagePayload } from "../../common/message-types/server.ts";

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
		handlePong();
	} else if (message.type == ServerMessageTypes.STATS) {
		handleStats(message.payload);
	}
}

function handlePlayerInit(payload: PlayerInitMessagePayload) {
	//
}

function handleState(payload: StateMessagePayload) {
	//
}

function handleTeam(payload: TeamMessagePayload) {
	//
}

function handleCompletedAction(action: PlayerAction) {
	//
}

function handleCarrying(payload: CarryingMessagePayload) {
	//
}

function handleDeath(cause: DeathCause) {
	//
}

function handlePong() {
	//
}

function handleStats(payload: StatsMessagePayload) {
	//
}
