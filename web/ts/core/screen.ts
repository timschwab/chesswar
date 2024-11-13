import { Hook } from "../../../common/data-structures/Hook.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { ZeroPoint } from "../../../common/shapes/Zero.ts";

const hook = new Hook<Rect>();

let screenValue = getScreen();

globalThis.addEventListener("resize", () => {
	const screenRect = getScreen()
	screenValue = screenRect;
	hook.run(screenRect);
});

function getScreen(): Rect {
	// Get the window dimensions
	const width = globalThis.innerWidth;
	const height = globalThis.innerHeight;

	// Construct the rect
	const screenRect = new Rect(ZeroPoint, new Point(width, height));
	return screenRect;
}

// Use the callback immediately with the current screenValue
// and then update it with all future values.
export function bindToScreen(callback: (screenRect: Rect) => void) {
	callback(screenValue);
	hook.register(callback);
}

export function bindCanvasToScreen(canvas: HTMLCanvasElement) {
	bindToScreen(newScreen => {
		canvas.width = newScreen.width;
		canvas.height = newScreen.height;
	});
}
