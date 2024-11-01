import { getAttachedCanvas, getCanvas } from "./core/dom.ts";

initGame();

export function initGame() {
	webglInit();
	requestAnimationFrame(gameLoop);
}

function webglInit() {
	//
}

function gameLoop() {
	// requestAnimationFrame(gameLoop);

	// Get the fake canvas
	const canvas = getAttachedCanvas();
	const context = canvas.getContext("2d");
	if (context === null) {
		return;
	}

	// Font settings
	const fontFamily = "Courier New";
	const fontHeight = "128px";
	const font = `${fontHeight} ${fontFamily}`;

	// Set initial values for the canvas
	context.fillStyle = "white";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.font = font;

	// Get metrics on this browser's implementation of the font
	const metrics = context.measureText(".");
	const letterHeight = Math.ceil(metrics.actualBoundingBoxDescent-metrics.actualBoundingBoxAscent);
	const oneLetterWidth = Math.ceil(metrics.actualBoundingBoxRight-metrics.actualBoundingBoxLeft);

	// Write the first letter
	canvas.width = oneLetterWidth;
	canvas.height = letterHeight;

	context.fillStyle = "white";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.font = font;

	context.fillText("A", oneLetterWidth*0, 0);

	// Expand the canvas to fit the second letter
	const savedData = context.getImageData(0, 0, oneLetterWidth, letterHeight);
	canvas.width = oneLetterWidth*2;
	context.putImageData(savedData, 0, 0);

	// Write the second letter
	context.fillStyle = "white";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.font = font;

	context.fillText("B", oneLetterWidth*1, 0);

	//const dataUrl = canvas.toDataURL();
	//const image = new Image();
	//image.src = dataUrl;
}
