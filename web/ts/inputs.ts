import { ClientMessageTypes, KeysMessagePayload } from "../../common/message-types/types-client.ts";
import socket from "./socket.ts";

enum ArrowEvent {
	ArrowLeft = "left",
	ArrowRight = "right",
	ArrowUp = "up",
	ArrowDown = "down"
}

function isArrowEvent(code: string): code is keyof typeof ArrowEvent {
	if (code in ArrowEvent) {
		return true;
	} else {
		return false;
	}
}

const keys: KeysMessagePayload = {
	left: false,
	right: false,
	up: false,
	down: false
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
	const code = event.code;

	if (isArrowEvent(code)) {
		// Record state
		const key = ArrowEvent[code];
		keys[key] = pressed;

		// Update server
		socket.send({
			type: ClientMessageTypes.KEYS,
			payload: keys
		});
	}
}

export default { init };
