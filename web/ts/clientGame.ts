import { CWColor } from "../../common/Color.ts";
import { Point } from "../../common/shapes/Point.ts";
import { CWText } from "./webgl/text/CWText.ts";
import { TextRenderer } from "./webgl/text/TextRenderer.ts";

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

	const message = "ABC 123 $%^ | . ?";
	const topLeft = new Point(50, 50);
	const scale = 1;
	const color = CWColor.GREY_BLACK;
	const renderer = new TextRenderer();
	renderer.renderText(new CWText(message, topLeft, scale, color));
}
