import { getAttachedCanvas, getCanvas } from "./core/dom.ts";
import { ExpandingTextCanvas } from "./text/ExpandingTextCanvas.ts";

initGame();

export function initGame() {
	webglInit();
	requestAnimationFrame(gameLoop);
}

function webglInit() {
	//
}

function gameLoop() {
	// requestAnimationFrame(gameLoop);

	// Get the fake canvas
	const expandingTexture = new ExpandingTextCanvas();
}
