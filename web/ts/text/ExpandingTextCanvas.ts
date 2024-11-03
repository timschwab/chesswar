import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { ZeroPoint } from "../../../common/shapes/Zero.ts";
import { getCanvas } from "../core/dom.ts";

// Font settings
const FONT_FAMILY = "Courier New";
const FONT_HEIGHT = "128px";
const FONT = `${FONT_HEIGHT} ${FONT_FAMILY}`;

export class ExpandingTextCanvas {
	private readonly canvas = getCanvas();
	private readonly context = this.getContext();
	readonly letterBoundingBox = this.getLetterBoundingBox();
	private letterCount = 0;

	constructor() {
		// Set initial values and flags
		this.canvas.width = 0;
		this.canvas.height = this.letterBoundingBox.height;
	}

	private getContext(): CanvasRenderingContext2D {
		const context = this.canvas.getContext("2d", {
			willReadFrequently: true // Optimization flagged to me by Chrome
		});
		if (context === null) {
			throw "Could not get canvas context";
		} else {
			return context;
		}
	}

	private getLetterBoundingBox(): Rect {
		// Set initial values for the canvas
		this.setStyleValues();
	
		// Get metrics on this browser's implementation of the font
		const metrics = this.context.measureText(".");
		const oneLetterWidth = Math.ceil(metrics.actualBoundingBoxRight-metrics.actualBoundingBoxLeft);
		const oneLetterHeight = Math.ceil(metrics.actualBoundingBoxDescent-metrics.actualBoundingBoxAscent);
	
		return new Rect(ZeroPoint, new Point(oneLetterWidth, oneLetterHeight));
	}

	private setStyleValues(): void {
		this.context.fillStyle = "white";
		this.context.textAlign = "left";
		this.context.textBaseline = "top";
		this.context.font = FONT;
	}

	addLetter(letter: string): number {
		// Validate it is only one letter
		if (letter.length !== 1) {
			throw "Expected exactly one letter but found " + letter.length + " instead.";
		}

		// Compute vars
		const previousWidth = this.canvas.width;
		const newWidth = previousWidth + this.letterBoundingBox.width;

		// Expand canvas to fit the new letters
		if (this.letterCount > 0) {
			const savedData = this.context.getImageData(0, 0, previousWidth, this.canvas.height);
			this.canvas.width = newWidth;
			this.context.putImageData(savedData, 0, 0);
		} else {
			this.canvas.width = newWidth;
		}

		// Write the new letter
		this.setStyleValues();
		this.context.fillText(letter, previousWidth, 0);

		// Return the new index
		return this.letterCount++;
	}

	getTexture(): Promise<HTMLImageElement> {
		const image = new Image();
		image.src = this.canvas.toDataURL();

		return new Promise<HTMLImageElement>((resolve, _reject) => {
			image.onload = () => resolve(image);
		});
	}
}
