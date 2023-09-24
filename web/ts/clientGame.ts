import { listenClick, listenKey } from "./core/inputs.ts";
import { screenChange, screenValue } from "./core/screen.ts";
import { socketListen } from "./core/socket.ts";
import { handleScreenChange } from "./game-logic/camera.ts";
import { handleKey } from "./game-logic/keys.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { recordJsRenderTime } from "./game-logic/statsManager.ts";
import { scene } from "./scene/scene.ts";
import { handleClick } from "./ui/GeneralWindowHelper.ts";
import { ui } from "./ui/ui.ts";

initGame();

export function initGame() {
	socketListen(receiveMessage);

	handleScreenChange(screenValue);
	screenChange(handleScreenChange);

	listenKey(handleKey);
	listenClick(handleClick);

	gameLoop();
}

function gameLoop() {
	const start = performance.now();

	scene.render();
	ui.render();

	const finish = performance.now();
	const diff = finish-start;
	recordJsRenderTime(diff);

	requestAnimationFrame(gameLoop);
}
