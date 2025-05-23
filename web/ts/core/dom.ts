export const gameRoot = document.getElementById("canvas-root") as HTMLDivElement;

export function getAttachedCanvas(zIndex?: number): HTMLCanvasElement {
	const htmlCanvas = getCanvas();
	if (zIndex != null) {
		htmlCanvas.style.zIndex = String(zIndex);
	}
	gameRoot.appendChild(htmlCanvas);
	return htmlCanvas;
}

export function getCanvas(): HTMLCanvasElement {
	return document.createElement("canvas");
}
