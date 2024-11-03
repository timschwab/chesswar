import { TextRenderer } from "./text/TextRenderer.ts";

initGame();

export async function initGame() {
	await webglInit();
	requestAnimationFrame(gameLoop);
}


async function webglInit() {
	//
}

function gameLoop() {
	// requestAnimationFrame(gameLoop);
	const renderer = new TextRenderer();
	renderer.renderText("A");
}
