import socket from "./socket.ts";
import state, { PlayerMap, isSafeState } from "./state.ts";
import render from "./render.ts";
import { PlayerInitMessagePayload, ServerMessage, ServerMessageTypes, StateMessagePayload } from "../../common/message-types/types-server.ts";
import { ChesswarId } from "../../common/data-types/types-base.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";

function init() {
	socket.listen(receiveMessage);
	gameLoop();
}

function receiveMessage(message: ServerMessage): void {
	if (message.type == ServerMessageTypes.PLAYER_INIT) {
		handlePlayerInit(message.payload);
	} else if (message.type == ServerMessageTypes.STATE) {
		handleState(message.payload);
	}
}

function handlePlayerInit(payload: PlayerInitMessagePayload) {
	state.self = payload.id;
}

function handleState(payload: StateMessagePayload) {
	const playerMap: PlayerMap = new Map<ChesswarId, ClientPlayer>();
	for (const player of payload) {
		playerMap.set(player.id, player);
	}

	state.playerMap = playerMap;
}

function gameLoop() {
	if (isSafeState(state)) {
		render(state);
	}

	requestAnimationFrame(gameLoop);
}

export default { init };
