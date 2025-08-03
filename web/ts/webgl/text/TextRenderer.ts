import { Point } from "../../../../common/shapes/Point.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { ExpandingGlyphTexture } from "./ExpandingGlyphTexture.ts";


export class TextRenderer {
	private readonly glyphTexture: ExpandingGlyphTexture;
	private readonly renderer: WebglRenderer;

	constructor() {
		this.glyphTexture = new ExpandingGlyphTexture();

		// Prepare the rectangle rendering data
		const rectangleData = [
			new Point(0, 0), new Point(0, 1), new Point(1, 0),
								new Point(0, 1), new Point(1, 0), new Point(1, 1)
		];
		const attributePointData = new Map([[VERTEX, rectangleData]]);
	}
}
