export class Dom {
	private readonly gameRoot: HTMLDivElement;

	constructor() {
		const maybeGameRoot = document.getElementById("canvas-root");
		if (maybeGameRoot === null) {
			throw "Could not find canvas-root element";
		} else {
			// Not sure how to properly check that this is a <div>
			this.gameRoot = maybeGameRoot as HTMLDivElement;
		}
	}

	getFloatingCanvas(): HTMLCanvasElement {
		return document.createElement("canvas");
	}

	getAttachedCanvas(): HTMLCanvasElement {
		const canvas = this.getFloatingCanvas();
		this.gameRoot.appendChild(canvas);
		return canvas;
	}
}
