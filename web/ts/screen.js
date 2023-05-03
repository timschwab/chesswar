import dom from "./dom.ts";
import state from "./state.ts";

function init() {
	setScreen();
	window.addEventListener("resize", setScreen);
}

function setScreen() {
	let width = window.innerWidth;
	let height = window.innerHeight;

	state.data.screen = {
		width,
		height
	};

	// Set the canvas dimensions too
	dom.canvas.width = width;
	dom.canvas.height = height;
}

export default { init };
