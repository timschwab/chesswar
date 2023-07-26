import { Point, Rect } from "../../common/shapes/types.ts";
import dom from "./dom.ts";
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
	state.screen = Rect(Point(0, 0), Point(width, height));

	// Set them in the dom
	for (const canvas of Object.values(dom)) {
		canvas.width = width;
		canvas.height = height;
	}
}
