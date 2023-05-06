import socket from "./socket.js";

const keys = {
	left: false,
	right: false,
	up: false,
	down: false
};

const mapping = {
	ArrowLeft: "left",
	ArrowRight: "right",
	ArrowUp: "up",
	ArrowDown: "down"
};

function init() {
	document.addEventListener("keydown", handleKeydown);
	document.addEventListener("keyup", handleKeyup);
}

function handleKeydown(event: KeyboardEvent) {
	if (event.repeat) {
		// Do nothing
		return;
	}

	handleKey(event, true);
}

function handleKeyup(event: KeyboardEvent) {
	handleKey(event, false);
}

function handleKey(event: KeyboardEvent, pressed: boolean) {
	const mapped = mapping[event.code];
	if (mapped) {
		keys[mapped] = pressed;
	}

	updateServer();
}

function updateServer() {
	socket.send({
		type: "keys",
		payload: keys
	});
}

export default { init };
