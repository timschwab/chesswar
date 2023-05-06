import socket from "./socket.ts";
import state, { PlayerMap } from "./state.ts";
import render from "./render.js";
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
	state.data.self = payload.id;
}

function handleState(payload: StateMessagePayload) {
	const playerMap: PlayerMap = new Map<ChesswarId, ClientPlayer>();
	for (const player of payload) {
		playerMap.set(player.id, player);
	}

	state.data.playerMap = playerMap;
}

function gameLoop() {
	if (stateReady()) {
		render(state.data);
	}

	requestAnimationFrame(gameLoop);
}

function stateReady(): boolean {
	if (!state.data.screen) {
		return false;
	}

	if (!state.data.self) {
		return false;
	}

	if (!state.data.playerMap) {
		return false;
	}

	return true;
}

export default { init };
