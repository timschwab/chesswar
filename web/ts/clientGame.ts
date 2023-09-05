import { screenChange, screenValue } from "./core/screen.ts";
import { socketListen } from "./core/socket.ts";
import { handleScreenChange } from "./game-logic/camera.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { scene } from "./scene/scene.ts";

initGame();

export function initGame() {
	socketListen(receiveMessage);

	handleScreenChange(screenValue);
	screenChange(handleScreenChange);

	gameLoop();
}

function gameLoop() {
	scene.render();
	requestAnimationFrame(gameLoop);
}
