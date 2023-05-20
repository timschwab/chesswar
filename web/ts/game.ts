import socket from "./socket.ts";
import state, { PlayerMap, isSafeState } from "./state.ts";
import render from "./render.ts";
import { PlayerInitMessagePayload, ServerMessage, ServerMessageTypes, StateMessagePayload } from "../../common/message-types/types-server.ts";
import { ChesswarId, PlayerRole } from "../../common/data-types/types-base.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";
import { Point } from "../../common/data-types/shapes.ts";
import { listenClick } from "./inputs.ts";

export function initGame() {
	socket.listen(receiveMessage);
	listenClick(receiveClick);
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
	state.selfId = payload.id;
	state.teamBoard = payload.teamBoard
}

function handleState(payload: StateMessagePayload) {
	const playerMap: PlayerMap = new Map<ChesswarId, ClientPlayer>();
	for (const player of payload) {
		playerMap.set(player.id, player);
	}

	state.playerMap = playerMap;

	if (state.selfId) {
		const maybeSelf = state.playerMap.get(state.selfId);

		if (!maybeSelf) {
			console.error(state.playerMap, state.selfId);
			throw "Could not find self";
		}

		state.self = maybeSelf;
	}
}

function receiveClick(_location: Point): void {
	if (!isSafeState(state)) {
		return;
	}

	if (state.self.role != PlayerRole.GENERAL) {
		return;
	}

	// 
}

function gameLoop() {
	if (isSafeState(state)) {
		render(state);
	}

	requestAnimationFrame(gameLoop);
}
