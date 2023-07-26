enum CanvasName { FIELD, UI }

type CanvasKey = keyof typeof CanvasName;

const gameRoot = window.document.getElementById("game");

function createCanvas(index: number): HTMLCanvasElement {
	if (gameRoot == null) {
		throw "Could not find game div";
	}

	const canvas = document.createElement("canvas");
	canvas.style.zIndex = String(index);
	gameRoot.appendChild(canvas);
	return canvas;
}

// Very annoying how much you have to hand-hold TypeScript here
// But couldn't find a better way
const canvasKeys = Object.keys(CanvasName) as CanvasKey[];
const canvasEntries = canvasKeys.map((name, index) => [name, createCanvas(index)] as [CanvasKey, HTMLCanvasElement]);
const canvasObject = Object.fromEntries(canvasEntries) as {
    [k in CanvasKey]: HTMLCanvasElement;
};

export default canvasObject;
