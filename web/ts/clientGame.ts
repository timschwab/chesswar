import { CWColor } from "../../common/Color.ts";
import { Point } from "../../common/shapes/Point.ts";
import { Rect } from "../../common/shapes/Rect.ts";
import { getAttachedCanvas } from "./dom.ts";
import { CWText, CWTextAlign } from "./text/CWText.ts";
import { webglInit } from "./webgl/webglRender.ts";

initGame();

export function initGame() {
	webglInit();
	requestAnimationFrame(gameLoop);
}

const t6 = new CWText(
	new Rect(new Point(0, -15), new Point(5000, 20)),
	6, CWColor.GREY_WHITE, CWTextAlign.LEFT, "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"
);
const t10 = new CWText(
	new Rect(new Point(0, 0), new Point(5000, 20)),
	10, CWColor.GREY_WHITE, CWTextAlign.LEFT, "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789"
);
const t30 = new CWText(
	new Rect(new Point(0, 25), new Point(5000, 50)),
	30, CWColor.GREY_WHITE, CWTextAlign.LEFT, "NOPQRSTUVWXYZ 0123456789"
);
const t50 = new CWText(
	new Rect(new Point(0, 100), new Point(5000, 100)),
	50, CWColor.GREY_WHITE, CWTextAlign.LEFT, "NOPQRSTUVWXYZ 0123456789"
);
const t100 = new CWText(
	new Rect(new Point(0, 200), new Point(5000, 200)),
	100, CWColor.GREY_WHITE, CWTextAlign.LEFT, "WXYZ 0123456789"
);
const t200 = new CWText(
	new Rect(new Point(0, 400), new Point(5000, 400)),
	200, CWColor.GREY_WHITE, CWTextAlign.LEFT, "0123456789"
);
const structs = [
	t6.toStructures(),
	t10.toStructures(),
	t30.toStructures(),
	t50.toStructures(),
	t100.toStructures(),
	t200.toStructures()
].flat();

function gameLoop() {
	// draw text on the canvas
	const canvas = getAttachedCanvas();
	const context = canvas.getContext("2d");
	if (context === null) {
		return;
	}

	canvas.width = 1000;
	canvas.height = 1000;

	context.fillStyle = "white";
	context.font = "128px Courier New";
	context.fillText("A", 100, 100);

	const data = context.getImageData(0, 0, 1000, 1000);
	canvas.width = 2000;
	canvas.height = 2000;
	context.putImageData(data, 0, 0);

	const dataUrl = canvas.toDataURL();
	const image = new Image();
	image.src = dataUrl;
}
