import { objectMap } from "../../common/typescript-utils.ts";

enum CanvasName { FIELD, UI }

const gameRoot = window.document.getElementById("game");

function createCanvas(_key: string, index: number): HTMLCanvasElement {
	if (gameRoot == null) {
		throw "Could not find game div";
	}

	const canvas = document.createElement("canvas");
	canvas.style.zIndex = String(index);
	gameRoot.appendChild(canvas);
	return canvas;
}

const canvasObject = objectMap<keyof typeof CanvasName, HTMLCanvasElement>(CanvasName, createCanvas);

export default canvasObject;
