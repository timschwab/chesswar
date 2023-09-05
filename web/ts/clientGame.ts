import { listenKey } from "./core/inputs.ts";
import { screenChange, screenValue } from "./core/screen.ts";
import { socketListen } from "./core/socket.ts";
import { handleScreenChange } from "./game-logic/camera.ts";
import { handleKey } from "./game-logic/keys.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { scene } from "./scene/scene.ts";

initGame();

export function initGame() {
	socketListen(receiveMessage);

	handleScreenChange(screenValue);
	screenChange(handleScreenChange);

	listenKey(handleKey);

	gameLoop();
}

function gameLoop() {
	scene.render();
	requestAnimationFrame(gameLoop);
}
