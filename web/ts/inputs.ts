import { ClientMessageTypes, MoveMessagePayload } from "../../common/message-types/types-client.ts";
import socket from "./socket.ts";

enum ArrowCode {
	ArrowLeft = "left",
	ArrowRight = "right",
	ArrowUp = "up",
	ArrowDown = "down"
}

function isArrowCode(code: string): code is keyof typeof ArrowCode {
	if (code in ArrowCode) {
		return true;
	} else {
		return false;
	}
}

const movement: MoveMessagePayload = {
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

function handleKey(event: KeyboardEvent, pressed: boolean): void {
	const code = event.code;

	if (isArrowCode(code)) {
		// Record state
		const key = ArrowCode[code];
		movement[key] = pressed;

		// Update server
		socket.send({
			type: ClientMessageTypes.MOVE,
			payload: movement
		});
	} else if (code == "Space") {
		// Send Switch command on keydown but not keyup
		if (pressed) {
			socket.send({
				type: ClientMessageTypes.COMMAND,
				payload: null
			});
		}
	} else {
		console.log("Unused key code", code);
	}
}

export default { init };
