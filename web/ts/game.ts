import socket from "./socket.ts";
import state, { PlayerMap, isSafeState } from "./state.ts";
import render from "./render.ts";
import { PlayerInitMessagePayload, ServerMessage, ServerMessageTypes, StateMessagePayload, TeamMessagePayload } from "../../common/message-types/types-server.ts";
import { ChesswarId, PlayerRole } from "../../common/data-types/types-base.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";
import { Point } from "../../common/data-types/shapes.ts";
import { listenClick } from "./inputs.ts";
import { clickedButton, clickedSquare } from "./generalWindow.ts";
import { ClientMessageTypes } from "../../common/message-types/types-client.ts";

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
	}
}

function handlePlayerInit(payload: PlayerInitMessagePayload) {
	state.selfId = payload.id;
}

function handleState(payload: StateMessagePayload) {
	const playerMap: PlayerMap = new Map<ChesswarId, ClientPlayer>();
	for (const player of payload.players) {
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

	state.victory = payload.victory;
}

function handleTeam(payload: TeamMessagePayload) {
	state.teamBoard = payload.board;
	state.briefings = payload.briefings;
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
		state.renderCount++;
	}

	requestAnimationFrame(gameLoop);
}
