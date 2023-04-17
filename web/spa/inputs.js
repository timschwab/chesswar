import socket from "./socket.js";

let keys = {
	left: false,
	right: false,
	up: false,
	down: false
};

let mapping = {
	ArrowLeft: "left",
	ArrowRight: "right",
	ArrowUp: "up",
	ArrowDown: "down"
};

function init() {
	document.addEventListener("keydown", handleKeydown);
	document.addEventListener("keyup", handleKeyup);
}

function handleKeydown(event) {
	if (event.repeat) {
		// Do nothing
		return;
	}

	handleKey(event, true);
}

function handleKeyup(event) {
	handleKey(event, false);
}

function handleKey(event, pressed) {
	let mapped = mapping[event.code];
	if (mapped) {
		keys[mapped] = pressed;
	}

	updateServer();
}

function updateServer() {
	socket.send({
		type: "keys",
		value: keys
	});
}

export default { init };
