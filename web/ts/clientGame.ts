import { listenClick, listenKey } from "./core/inputs.ts";
import { screenChange, screenValue } from "./core/screen.ts";
import { socketListen } from "./core/socket.ts";
import { handleScreenChange } from "./game-logic/camera.ts";
import { handleKey } from "./game-logic/keys.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { beginPings } from "./game-logic/pingManager.ts";
import { recordAnimationTime, recordJsRenderTime } from "./game-logic/statsManager.ts";
import { scene } from "./scene/scene.ts";
import { handleClick } from "./ui/GeneralWindowHelper.ts";
import { ui } from "./ui/ui.ts";

initGame();

export function initGame() {
	socketListen(receiveMessage);
	beginPings();

	handleScreenChange(screenValue);
	screenChange(handleScreenChange);

	listenKey(handleKey);
	listenClick(handleClick);

	requestAnimationFrame(gameLoop);
}

let prevTimestamp = 0;
function gameLoop(timestamp: number) {
	const start = performance.now();

	const animationTimeDiff = timestamp - prevTimestamp;
	prevTimestamp = timestamp;
	recordAnimationTime(animationTimeDiff);

	scene.render();
	ui.render();

	const finish = performance.now();
	const jsTimeDiff = finish-start;
	recordJsRenderTime(jsTimeDiff);

	requestAnimationFrame(gameLoop);
}
