import { createHook } from "../../../common/hooks.ts";
import { Point } from "../../../common/shapes/Point.ts";

enum CWKey {
	UP = "up",
	DOWN = "down",
	LEFT = "left",
	RIGHT = "right",
	COMMAND = "command",
	STATS = "stats"
}

const KeyCodeTranslation = {
	ArrowLeft: CWKey.LEFT,
	ArrowRight: CWKey.RIGHT,
	ArrowUp: CWKey.UP,
	ArrowDown: CWKey.DOWN,

	KeyW: CWKey.UP,
	KeyA: CWKey.LEFT,
	KeyS: CWKey.DOWN,
	KeyD: CWKey.RIGHT,

	Space: CWKey.COMMAND,
	Period: CWKey.STATS
}

interface CWKeyEvent {
	key: CWKey,
	pressed: boolean
}

function isTranslatable(code: string): code is keyof typeof KeyCodeTranslation {
	if (code in KeyCodeTranslation) {
		return true;
	} else {
		return false;
	}
}

const clickHook = createHook<Point>();
const keyHook = createHook<CWKeyEvent>();

document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);
document.addEventListener("click", handleClick);

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

	if (isTranslatable(code)) {
		const key = KeyCodeTranslation[code];
		keyHook.run({
			key,
			pressed
		});
	} else {
		console.log("Unused key code", code);
	}
}

function handleClick(event: MouseEvent) {
	const location = new Point(event.clientX, event.clientY);
	clickHook.run(location);
}

export const listenClick = clickHook.register;
export const listenKey = keyHook.register;
