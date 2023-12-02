export const gameRoot = window.document.getElementById("canvas-root") as HTMLDivElement;

export function createHtmlCanvas(zIndex?: number): HTMLCanvasElement {
	const htmlCanvas = document.createElement("canvas");
	if (zIndex != null) {
		htmlCanvas.style.zIndex = String(zIndex);
	}
	gameRoot.appendChild(htmlCanvas);
	return htmlCanvas;
}
