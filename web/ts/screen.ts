import dom from "./dom.ts";
import state from "./state.ts";

function init() {
	setScreen();
	globalThis.addEventListener("resize", setScreen);
}

function setScreen() {
	// Get the window dimensions
	const width = window.innerWidth;
	const height = window.innerHeight;

	// Record them in the state
	state.screen = {
		width,
		height
	};

	// Set them in the dom
	dom.canvas.width = width;
	dom.canvas.height = height;
}

export default { init };
