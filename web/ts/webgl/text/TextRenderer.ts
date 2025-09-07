import { Point } from "../../../../common/shapes/Point.ts";
import { CWDom } from "../../core/CWDom.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { CWText } from "./CWText.ts";
import { ExpandingGlyphTexture } from "./ExpandingGlyphTexture.ts";
import textFragmentShader from "./glsl-generated/textFragmentShader.ts";
import textVertexShader from "./glsl-generated/textVertexShader.ts";


// Overall settings
const SCREEN = "u_screen";
const GLYPH_BOUNDING_BOX = "u_glyph_bounding_box";
const GLYPH_COUNT = "u_glyph_count";

// Settings per glyph
const LEFT_TOP = "u_left_top";
const SCALE = "u_scale";
const GRAPHEME_POSITION = "u_grapheme_position";
const GLYPH_INDEX = "u_glyph_index";
const COLOR = "u_color";

const VERTEX = "a_vertex";

export class TextRenderer {
	private readonly glyphTexture: ExpandingGlyphTexture;
	private readonly renderer: WebglRenderer;
	private readonly graphemeToGlyphMap: Map<string, number>;

	constructor(dom: CWDom, screen: CWScreen) {
		this.glyphTexture = new ExpandingGlyphTexture(dom);
		this.graphemeToGlyphMap = new Map();

		// Prepare the rectangle rendering data
		const rectangleData = [
			new Point(0, 0), new Point(0, 1), new Point(1, 0),
			                 new Point(0, 1), new Point(1, 0), new Point(1, 1)
		];
		const attributePointData = new Map([[VERTEX, rectangleData]]);

		// Create the renderer
		this.renderer = new WebglRenderer(dom, screen, {
			shaderSource: {
				vertex: textVertexShader,
				fragment: textFragmentShader
			},
			uniformNames: {
				screen: SCREEN,
				values: [GLYPH_COUNT, SCALE, GRAPHEME_POSITION, GLYPH_INDEX],
				points: [GLYPH_BOUNDING_BOX, LEFT_TOP],
				colors: [COLOR]
			},
			attributeData: {
				points: attributePointData
			}
		});

		// Setup the renderer
		this.renderer.setUniformPoint(GLYPH_BOUNDING_BOX, this.glyphTexture.getGlyphBoundingBox().rightBottom);
		this.renderer.createTexture();
	}

	render(textList: CWText[]) {
		// Add any new glyphs to the texture
		this.ensureGlyphsAdded(textList);

		// Draw all the texts
		for (const text of textList) {
			// Set the text-global uniforms
			this.renderer.setUniformPoint(LEFT_TOP, text.leftTop);
			this.renderer.setUniformValue(SCALE, text.scale);
			this.renderer.setUniformColor(COLOR, text.color);

			// Set the grapheme-specific uniforms
			text.graphemes.forEach((grapheme, graphemePosition) => {
				this.renderer.setUniformValue(GRAPHEME_POSITION, graphemePosition);
				const glyphIndex = this.graphemeToGlyphMap.get(grapheme);
				if (glyphIndex !== undefined) {
					this.renderer.setUniformValue(GLYPH_INDEX, glyphIndex);
					this.renderer.draw();
				}
			});
		}
	}

	private ensureGlyphsAdded(textList: CWText[]) {
		// Split text into graphemes
		const allGraphemes = textList.flatMap(text => text.graphemes);

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
			const texture = this.glyphTexture.getTexture();
			this.renderer.setTextureData(texture);

			// Set the new texture size
			this.renderer.setUniformValue(GLYPH_COUNT, this.graphemeToGlyphMap.size);
		}
	}
}
