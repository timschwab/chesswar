export const gameRoot = window.document.getElementById("game") as HTMLDivElement;

export function createHtmlCanvas(): HTMLCanvasElement {
	const htmlCanvas = document.createElement("canvas");
	gameRoot.appendChild(htmlCanvas);
	return htmlCanvas;
}
