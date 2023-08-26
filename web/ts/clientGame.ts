import socket from "./socket.ts";
import state, { isSafeState } from "./state.ts";
import { renderAll } from "./render/renderAll.ts";
import { ServerMessage, ServerMessageTypes } from "../../common/message-types/server.ts";
import { listenClick } from "./inputs.ts";
import { ClientMessageTypes } from "../../common/message-types/client.ts";
import { handleCarrying, handleCompletedAction, handleDeath, handlePlayerInit, handlePong, handleState, handleStats, handleTeam } from "./messages.ts";
import { receiveClick } from "./click.ts";
import { CWCamera } from "./CWCamera.ts";
import canvas from "./canvas/canvas.ts";

const camera = new CWCamera(canvas.FIELD_BACKGROUND);

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

function gameLoop() {
	if (isSafeState(state)) {
		renderAll(state);
	}

	if (state.count > state.stats.nextPingCount) {
		state.stats.nextPingCount = Infinity;
		state.stats.thisPingSend = performance.now();
		socket.send({
			type: ClientMessageTypes.PING,
			payload: null
		});
	}

	state.count++;
	requestAnimationFrame(gameLoop);
}
