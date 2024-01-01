import map from "../../common/map.ts";
import { listenKey } from "./core/inputs.ts";
import { socketListen } from "./core/socket.ts";
import { handleKey } from "./game-logic/keys.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { beginPings } from "./game-logic/pingManager.ts";
import { state } from "./game-logic/state.ts";
import { drawTriangles, webglInit } from "./webgl/webglRender.ts";

initGame();

export function initGame() {
	webglInit();

	socketListen(receiveMessage);
	beginPings();

	//handleScreenChange(screenValue);
	//screenChange(handleScreenChange);

	listenKey(handleKey);
	//listenClick(handleClick);

	requestAnimationFrame(gameLoop);
}

const triangles = map.shape.toTriangles();
console.log(triangles);

function gameLoop() {
	requestAnimationFrame(gameLoop);

	if (state.selfPlayer) {
		drawTriangles(triangles, state.selfPlayer.position.center);
	}
}

/*let prevTimestamp = 0;
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
}*/
