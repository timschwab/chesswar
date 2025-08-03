import { ExpandingGlyphTexture } from "./ExpandingGlyphTexture.ts";


export class TextRenderer {
	private readonly glyphTexture: ExpandingGlyphTexture;

	constructor() {
		this.glyphTexture = new ExpandingGlyphTexture();
	}
}
