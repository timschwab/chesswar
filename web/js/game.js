import socket from "./socket.js";
import state from "./state.js";
import render from "./render.js";

function init() {
	socket.listen("player-init", handlePlayerInit);
	socket.listen("map", handleMap);
	socket.listen("players", handlePlayers);

	gameLoop();
}

function handlePlayerInit(value) {
	state.data.self = value.id;
}

function handleMap(value) {
	state.data.map = value;
}

function handlePlayers(value) {
	state.data.players = value;
}

function gameLoop() {
	if (stateReady()) {
		render(state.data);
	}

	requestAnimationFrame(gameLoop);
}

function stateReady() {
	if (!state.data.self) {
		return false;
	}

	if (!state.data.map) {
		return false;
	}

	if (!state.data.players) {
		return false;
	}

	return true;
}

export default { init };
