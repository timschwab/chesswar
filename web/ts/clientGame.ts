import { CWColor } from "../../common/Color.ts";
import { rensets } from "../../common/settings.ts";
import { Point } from "../../common/shapes/Point.ts";
import { Rect } from "../../common/shapes/Rect.ts";
import { Shape } from "../../common/shapes/Shape.ts";
import { listenKey } from "./core/inputs.ts";
import { socketListen } from "./core/socket.ts";
import { handleKey } from "./game-logic/keys.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { beginPings } from "./game-logic/pingManager.ts";
import { state } from "./game-logic/state.ts";
import { mapTriangles } from "./mapTriangles.ts";
import { CWText, CWTextAlign } from "./text/CWText.ts";
import { getUiTriangles } from "./ui.ts";
import { drawStructures, webglInit } from "./webgl/webglRender.ts";

initGame();

export function initGame() {
	webglInit();

	socketListen(receiveMessage);
	beginPings();

	listenKey(handleKey);
	//listenClick(handleClick);

	requestAnimationFrame(gameLoop);
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	//const playerShapes = state.players.map(pl => Shape.from(pl.position, rensets.players.teamColor[pl.team]));
	//const playerTriangles = playerShapes.flatMap(sh => sh.toTriangles());
	//const allTriangles = mapTriangles.concat(playerTriangles).concat(getUiTriangles());

	if (state.selfPlayer) {
		//drawTriangles(allTriangles, state.selfPlayer.position.center);
		const t10 = new CWText(
			new Rect(new Point(0, 0), new Point(5000, 20)),
			10, CWColor.GREY_WHITE, CWTextAlign.LEFT, "fghijklm|nopqrstuvwxyz 1234567890"
		);
		const t25 = new CWText(
			new Rect(new Point(0, 25), new Point(5000, 50)),
			25, CWColor.GREY_WHITE, CWTextAlign.LEFT, "fghijklm|nopqrstuvwxyz 1234567890"
		);
		const t50 = new CWText(
			new Rect(new Point(0, 100), new Point(5000, 100)),
			50, CWColor.GREY_WHITE, CWTextAlign.LEFT, "fghijklm|nopqrstuvwxyz 1234567890"
		);
		const t100 = new CWText(
			new Rect(new Point(0, 200), new Point(5000, 200)),
			100, CWColor.GREY_WHITE, CWTextAlign.LEFT, "fghijklm|nopqrstuvwxyz 1234567890"
		);
		const t200 = new CWText(
			new Rect(new Point(0, 400), new Point(5000, 400)),
			200, CWColor.GREY_WHITE, CWTextAlign.LEFT, "fghijklm|nopqrstuvwxyz 1234567890"
		);
		const structs = [
			t10.toStructures(),
			t25.toStructures(),
			t50.toStructures(),
			t100.toStructures(),
			t200.toStructures()
		].flat();
		drawStructures(structs, new Point(700, 300));
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
