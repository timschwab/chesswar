import { Point } from "../../../../common/shapes/Point.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { CWText } from "./CWText.ts";
import { ExpandingGlyphTexture } from "./ExpandingGlyphTexture.ts";
import textFragmentShader from "./glsl-generated/textFragmentShader.ts";
import textVertexShader from "./glsl-generated/textVertexShader.ts";


const SCREEN = "u_screen";
const GLYPH_BOUNDING_BOX = "u_glyph_bounding_box";
const GLYPH_COUNT = "u_glyph_count";

const LEFT_TOP = "u_left_top";
const SCALE = "u_scale";
const GLYPH_INDEX = "u_glyph_index";
const COLOR = "u_color";

const VERTEX = "a_vertex";

export class TextRenderer {
	private readonly glyphTexture: ExpandingGlyphTexture;
	private readonly renderer: WebglRenderer;
	private readonly graphemeToGlyphMap: Map<string, number>;

	constructor() {
		this.glyphTexture = new ExpandingGlyphTexture();
		this.graphemeToGlyphMap = new Map();

		// Prepare the rectangle rendering data
		const rectangleData = [
			new Point(0, 0), new Point(0, 1), new Point(1, 0),
			                 new Point(0, 1), new Point(1, 0), new Point(1, 1)
		];
		const attributePointData = new Map([[VERTEX, rectangleData]]);

		// Create the renderer
		this.renderer = new WebglRenderer({
			shaderSource: {
				vertex: textVertexShader,
				fragment: textFragmentShader
			},
			uniformNames: {
				screen: SCREEN,
				values: [GLYPH_COUNT, SCALE, GLYPH_INDEX],
				points: [GLYPH_BOUNDING_BOX, LEFT_TOP],
				colors: [COLOR]
			},
			attributeData: {
				points: attributePointData
			}
		});
	}

	async render(textData: CWText[]) {
		// Add any new graphemes to the texture
		await this.ensureGraphemesAdded(textData);

		// Draw all the graphemes
	}

	private async ensureGraphemesAdded(textData: CWText[]) {
		// Split text into graphemes
		const allGraphemes = textData.flatMap(text => text.graphemes);

		// Find all graphemes we have never rendered before and update the texture if needed
		const newGraphemes = new Set(allGraphemes.filter(grapheme => !this.graphemeToGlyphMap.has(grapheme)));
		if (newGraphemes.size > 0) {
			console.log("Updating glyph texture");

			// Add them all to the glyph texture and map
			for (const grapheme of newGraphemes) {
				const index = this.glyphTexture.addGrapheme(grapheme);
				this.graphemeToGlyphMap.set(grapheme, index);
			}

			// Upload the new texture
			const texture = await this.glyphTexture.getTexture();
			this.renderer.setTextureData(texture);

			// Set the texture size uniform
			this.renderer.setUniformValue(GLYPH_COUNT, this.graphemeToGlyphMap.size);
		}
	}
}
