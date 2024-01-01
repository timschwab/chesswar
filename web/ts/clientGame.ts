import { CWColor } from "../../common/Color.ts";
import { Point } from "../../common/shapes/Point.ts";
import { Triangle, TriangleVertices } from "../../common/shapes/Triangle.ts";
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

const triangles = [
	new Triangle(
		new TriangleVertices(new Point(0, 0), new Point(100, 0), new Point(0, 100)),
		CWColor.RED_STANDARD
	),
	new Triangle(
		new TriangleVertices(new Point(1000, 0), new Point(900, 0), new Point(1000, 100)),
		CWColor.GREEN_STANDARD
	),
	new Triangle(
		new TriangleVertices(new Point(0, 1000), new Point(100, 1000), new Point(0, 900)),
		CWColor.RED_STANDARD
	),
	new Triangle(
		new TriangleVertices(new Point(1000, 1000), new Point(900, 1000), new Point(1000, 900)),
		CWColor.GREY_WHITE
	)
];

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
