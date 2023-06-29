import { Point } from "../../common/data-types/shapes.ts";
import { createHook } from "../../common/hooks.ts";
import { ClientMessageTypes, MoveMessagePayload } from "../../common/message-types/client.ts";
import socket from "./socket.ts";
import state from "./state.ts";

enum ArrowCode {
	ArrowLeft = "left",
	ArrowRight = "right",
	ArrowUp = "up",
	ArrowDown = "down",
	KeyW = "up",
	KeyA = "left",
	KeyS = "down",
	KeyD = "right"
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

const clickHook = createHook<Point>();

export function initInputs() {
	document.addEventListener("keydown", handleKeydown);
	document.addEventListener("keyup", handleKeyup);
	document.addEventListener("click", handleClick);
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
		// Send action on keydown but not keyup
		if (pressed) {
			socket.send({
				type: ClientMessageTypes.ACTION,
				payload: null
			});
		}
	} else if (code == "Period") {
		if (pressed) {
			// Toggle stats
			state.stats.show = !state.stats.show;
		}
	} else {
		console.log("Unused key code", code);
	}
}

function handleClick(event: MouseEvent) {
	const location = Point(event.clientX, event.clientY);
	clickHook.run(location);
}

export const listenClick = clickHook.register;
