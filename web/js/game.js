import socket from "./socket.js";
import state from "./state.js";
import render from "./render.js";

function init() {
	socket.listen("player-init", handlePlayerInit);
	socket.listen("state", handlePlayers);

	gameLoop();
}

function handlePlayerInit(value) {
	state.data.self = value.id;
}

function handlePlayers(value) {
	let indexed = value.reduce((acc, cur) => {
		acc[cur.player] = cur;
		return acc;
	}, {});

	state.data.players = indexed;
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

	if (!state.data.players) {
		return false;
	}

	return true;
}

export default { init };
