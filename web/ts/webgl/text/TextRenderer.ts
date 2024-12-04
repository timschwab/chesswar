import { ExpandingGlyphTexture } from "./ExpandingGlyphTexture.ts";
import textVertexShaderSource from "./glsl-generated/textVertexShader.ts";
import textFragmentShaderSource from "./glsl-generated/textFragmentShader.ts";
import { bindToScreen } from "../../core/screen.ts";
import type { CWText } from "./CWText.ts";
import { WebglRenderer } from "../WebglRenderer.ts";

export class TextRenderer {
	private readonly expandingTexture: ExpandingGlyphTexture;
	private readonly graphemeToGlyphMap: Map<string, number>;
	private readonly webgl: WebglRenderer;

	private readonly texLengthUniformLocation: WebGLUniformLocation;

	private readonly scaleBufferId: WebGLBuffer;
	private readonly textLeftTopBufferId: WebGLBuffer;
	private readonly glyphIndexBufferId: WebGLBuffer;
	private readonly glyphVertexBufferId: WebGLBuffer;
	private readonly texIndexBufferId: WebGLBuffer;
	private readonly colorBufferId: WebGLBuffer;

	private vertexCount: number = 0;

	constructor() {
		// Get the glyph texture and grapheme map
		this.expandingTexture = new ExpandingGlyphTexture();
		this.graphemeToGlyphMap = new Map();

		// Create the WebglRenderer
		this.webgl = new WebglRenderer(textVertexShaderSource, textFragmentShaderSource);

		// Grab uniform locations
		const glyphBoundingBoxLocation = this.webgl.uniformLocation("u_glyph_bounding_box");
		const screenUniformLocation = this.webgl.uniformLocation("u_screen");
		this.texLengthUniformLocation = this.webgl.uniformLocation("u_tex_length");

		// Set/bind the uniforms
		this.webgl.setUniformPoint(
			glyphBoundingBoxLocation, this.expandingTexture.glyphBoundingBox.rightBottom);
		bindToScreen(screenValue => this.webgl.setUniformPoint(
			screenUniformLocation, screenValue.rightBottom));

		// Get attribute buffers
		this.scaleBufferId = this.webgl.attributeBuffer("a_scale", 1);
		this.textLeftTopBufferId = this.webgl.attributeBuffer("a_text_top_left", 2);
		this.glyphIndexBufferId = this.webgl.attributeBuffer("a_glyph_index", 1);
		this.glyphVertexBufferId = this.webgl.attributeBuffer("a_glyph_vertex", 2);
		this.texIndexBufferId = this.webgl.attributeBuffer("a_tex_index", 2);
		this.colorBufferId = this.webgl.attributeBuffer("a_color", 3);

		// Create texture buffer. Note we don't actually need the buffer ID.
		this.webgl.textureBuffer();

		// Set parameters so we can render correctly. Would be nice to pull out the webgl
		// constants into their own class. Also I think these need more thought in order to
		// actually render the text nicely.
		this.webgl.textureParameter(
			this.webgl.gl().TEXTURE_2D, this.webgl.gl().TEXTURE_WRAP_S, this.webgl.gl().CLAMP_TO_EDGE);
		this.webgl.textureParameter(
			this.webgl.gl().TEXTURE_2D, this.webgl.gl().TEXTURE_WRAP_T, this.webgl.gl().CLAMP_TO_EDGE);
		this.webgl.textureParameter(
			this.webgl.gl().TEXTURE_2D, this.webgl.gl().TEXTURE_MIN_FILTER, this.webgl.gl().LINEAR);
	}

	async setTextData(textData: CWText[]) {
		// Split text into graphemes
		const allGraphemes = textData.flatMap(text => text.graphemes);

		// Find all graphemes we have never rendered before and update the texture if needed
		const newGraphemes = new Set(allGraphemes.filter(grapheme => !this.graphemeToGlyphMap.has(grapheme)));
		if (newGraphemes.size > 0) {
			// Add them all to the glyph texture and map
			for (const grapheme of newGraphemes) {
				const index = this.expandingTexture.addGrapheme(grapheme);
				this.graphemeToGlyphMap.set(grapheme, index);
			}

			// Upload the new texture
			const texture = await this.expandingTexture.getTexture();
			this.webgl.setTextureData(texture);

			// Set the texture size uniform
			this.webgl.setUniformValue(this.texLengthUniformLocation, this.graphemeToGlyphMap.size);
		}

		// Set the scale attribute
		const scales = textData.flatMap(text =>
			text.graphemes.flatMap(() => {
				return [
					text.scale,
					text.scale,
					text.scale,
					text.scale,
					text.scale,
					text.scale
				];
			})
		);
		this.webgl.setAttributeData(this.scaleBufferId, scales);

		// Set the text left top attribute
		const textLeftTops = textData.flatMap(text =>
			text.graphemes.flatMap(() => {
				const x = text.leftTop.x;
				const y = text.leftTop.y;
				return [
					x, y,
					x, y,
					x, y,
					x, y,
					x, y,
					x, y
				];
			})
		);
		this.webgl.setAttributeData(this.textLeftTopBufferId, textLeftTops);

		// Set the glyph index attribute
		const glyphIndices = textData.flatMap(text =>
			text.graphemes.flatMap((_grapheme, index) => {
				return [
					index,
					index,
					index,
					index,
					index,
					index
				];
			})
		);
		this.webgl.setAttributeData(this.glyphIndexBufferId, glyphIndices);

		// Set the glyph vertex attribute
		const glyphVertices = textData.flatMap(text =>
			text.graphemes.flatMap(() => {
				return [
					0, 0,
					1, 0,
					0, 1,
					0, 1,
					1, 0,
					1, 1
				];
			})
		);
		this.webgl.setAttributeData(this.glyphVertexBufferId, glyphVertices);

		// Set the color attribute
		const colors = textData.flatMap(text =>
			text.graphemes.flatMap(() => {
				const colorArray = text.color.asArray();
				return [
					...colorArray,
					...colorArray,
					...colorArray,
					...colorArray,
					...colorArray,
					...colorArray
				];
			})
		);
		this.webgl.setAttributeData(this.colorBufferId, colors);

		// Set the texture index attribute
		const textureIndices = textData.flatMap(text =>
			text.graphemes.flatMap(grapheme => {
				const index = this.graphemeToGlyphMap.get(grapheme);
				if (index === undefined) {
					throw "Could not find grapheme in graphemeToGlyphMap: " + grapheme;
				}

				const xLeft = index;
				const xRght = index+1;

				return [
					xLeft, 0,
					xRght, 0,
					xLeft, 1,
					xLeft, 1,
					xRght, 0,
					xRght, 1
				];
			})
		);
		this.webgl.setAttributeData(this.texIndexBufferId, textureIndices);

		// Store the vertex count
		this.vertexCount = allGraphemes.length*6;
	}

	render() {
		// Draw the triangles!
		this.webgl.draw(this.vertexCount);
	}
}
