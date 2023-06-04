import socket from "./socket.ts";
import state, { isSafeState } from "./state.ts";
import render from "./render.ts";
import { ServerMessage, ServerMessageTypes } from "../../common/message-types/types-server.ts";
import { PlayerRole } from "../../common/data-types/types-base.ts";
import { Point } from "../../common/data-types/shapes.ts";
import { listenClick } from "./inputs.ts";
import { clickedButton, clickedSquare } from "./generalWindow.ts";
import { ClientMessageTypes } from "../../common/message-types/types-client.ts";
import { handlePlayerInit, handlePong, handleState, handleStats, handleTeam } from "./messages.ts";

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
	} else if (message.type == ServerMessageTypes.TEAM) {
		handleTeam(message.payload);
	} else if (message.type == ServerMessageTypes.PONG) {
		handlePong();
	} else if (message.type == ServerMessageTypes.STATS) {
		handleStats(message.payload);
	}
}

function receiveClick(location: Point): void {
	if (!isSafeState(state)) {
		return;
	}

	if (state.self.role != PlayerRole.GENERAL) {
		return;
	}

	const button = clickedButton(state, location);
	const square = clickedSquare(state, location);
	if (button != null) {
		state.general.selectedButton = button;
		state.general.selectedFrom = null;
	} else if (state.general.selectedButton != null && square != null) {
		if (state.general.selectedFrom) {
			// Send command
			const payload = {
				briefing: state.general.selectedButton,
				move: {
					from: state.general.selectedFrom,
					to: square
				}
			};
			socket.send({
				type: ClientMessageTypes.GENERAL_ORDERS,
				payload
			});

			// Clear state
			state.general.selectedButton = null;
			state.general.selectedFrom = null;
		} else {
			state.general.selectedFrom = square;
		}
	}
}

function gameLoop() {
	if (isSafeState(state)) {
		render(state);
	}

	if (state.count > state.stats.nextPingCount) {
		state.stats.prevPingDelayMs = state.stats.thisPongRecv - state.stats.thisPingSend;

		state.stats.thisPingSend = performance.now();
		socket.send({
			type: ClientMessageTypes.PING,
			payload: null
		});

		state.stats.nextPingCount = Infinity;
	}

	state.count++;
	requestAnimationFrame(gameLoop);
}
