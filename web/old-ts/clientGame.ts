import { rensets } from "../../common/settings.ts";
import { handleScreenChange } from "./game-logic/camera.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { beginPings } from "./game-logic/pingManager.ts";
import { recordAnimationTime, recordJsRenderTime } from "./game-logic/statsManager.ts";
import { scene } from "./scene/scene.ts";
import { handleClick } from "./ui/GeneralWindowHelper.ts";
import { ui } from "./ui/ui.ts";

initGame();

export function initGame() {
	//socketListen(receiveMessage);
	beginPings();

	//handleScreenChange(screenValue);
	//screenChange(handleScreenChange);

	requestAnimationFrame(gameLoop);
}

let prevTimestamp = 0;
function gameLoop(timestamp: number) {
	requestAnimationFrame(gameLoop);

	const start = performance.now();
	const animationTimeDiff = timestamp - prevTimestamp;

	// Cap the FPS
	const expectedDiff = 1000/rensets.fps;
	if (animationTimeDiff < (expectedDiff-rensets.fpsMsMargin)) {
		return;
	}

	prevTimestamp = timestamp;
	recordAnimationTime(animationTimeDiff);

	scene.render();
	ui.render();

	const finish = performance.now();
	const jsTimeDiff = finish-start;
	recordJsRenderTime(jsTimeDiff);
}
