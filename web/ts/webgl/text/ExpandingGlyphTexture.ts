import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { ZeroPoint } from "../../../../common/shapes/Zero.ts";
import { getCanvas } from "../../core/dom.ts";

// https://stackoverflow.com/a/27331885/1455074
// A code point is the atomic unit of data in Unicode. Could be a character/letter or a diacritic.
// A grapheme is what is displayed as a single graphical unit.
// A glyph is an image containing the rendering of a grapheme.

// Font settings
const FONT_WEIGHT = "bold";
const FONT_FAMILY = "Courier New";
const FONT_HEIGHT = "128px";
const FONT = `${FONT_WEIGHT} ${FONT_HEIGHT} ${FONT_FAMILY}`;

export class ExpandingGlyphTexture {
	private readonly canvas;
	private readonly context;
	private readonly glyphBoundingBox;

	private glyphCount = 0;
	private canvasSize = 2;

	constructor() {
		this.canvas = getCanvas();
		this.context = this.getContext();
		this.glyphBoundingBox = this.computeGlyphBoundingBox();

		// Set initial values and flags
		this.canvas.width = this.glyphBoundingBox.width * this.canvasSize;
		this.canvas.height = this.glyphBoundingBox.height;
		this.setStyleValues();
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

	private computeGlyphBoundingBox(): Rect {
		// Set initial values for the canvas
		this.setStyleValues();
	
		// Get metrics on this browser's implementation of the font
		const metrics = this.context.measureText(".");
		const oneGlyphWidth = Math.ceil(metrics.actualBoundingBoxRight-metrics.actualBoundingBoxLeft);
		const oneGlyphHeight = Math.ceil(metrics.fontBoundingBoxDescent-metrics.fontBoundingBoxAscent);
	
		return new Rect(ZeroPoint, new Point(oneGlyphWidth, oneGlyphHeight));
	}

	private setStyleValues(): void {
		this.context.fillStyle = "white";
		this.context.textAlign = "left";
		this.context.textBaseline = "top";
		this.context.font = FONT;
	}

	getGlyphBoundingBox(): Rect {
		return this.glyphBoundingBox;
	}

	addGrapheme(grapheme: string): number {
		// Validate it is only one grapheme
		if (grapheme.length !== 1) {
			throw "Expected exactly one grapheme but found " + grapheme.length + " instead.";
		}

		// Check if the canvas must be expanded
		if (this.glyphCount === this.canvasSize) {
			// Compute new size
			const previousWidth = this.glyphBoundingBox.width * this.canvasSize;
			this.canvasSize = this.canvasSize * 2; // Exponential growth so that the average time to write is O(log n)
			const newWidth = this.glyphBoundingBox.width * this.canvasSize;

			// Expand canvas, saving old data
			const savedData = this.context.getImageData(0, 0, previousWidth, this.canvas.height);
			this.canvas.width = newWidth;
			this.context.putImageData(savedData, 0, 0);

			// Reset the lost style values
			this.setStyleValues();
		}

		// Convert the new grapheme to a glyph (by rendering it)
		const glyphLocation = this.glyphBoundingBox.width * this.glyphCount;
		this.context.fillText(grapheme, glyphLocation, 0);

		// Return the new index
		return this.glyphCount++;
	}

	getTexture(): ImageData {
		return this.context.getImageData(
			0, 0,
			this.glyphBoundingBox.width * this.glyphCount, this.glyphBoundingBox.height);
	}
}
