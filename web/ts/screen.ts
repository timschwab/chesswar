import { Point } from "../../common/shapes/Point.ts";
import { Rect } from "../../common/shapes/Rect.ts";
import { ZeroPoint } from "../../common/shapes/Zero.ts";
import dom from "./canvas/dom.ts";
import state from "./state.ts";

export function initScreen() {
	setScreen();
	globalThis.addEventListener("resize", setScreen);
}

function setScreen() {
	// Get the window dimensions
	const width = window.innerWidth;
	const height = window.innerHeight;

	// Record them in the state
	state.screen = new Rect(ZeroPoint, new Point(width, height));

	// Set them in the dom
	for (const canvas of Object.values(dom)) {
		canvas.width = width;
		canvas.height = height;
	}
}
