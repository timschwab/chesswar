import { ExpandingGlyphTexture } from "./ExpandingGlyphTexture.ts";
import { assignBuffer, setData } from "../webglUtils.ts";
import textVertexShaderSource from "./glsl-generated/textVertexShader.ts";
import textFragmentShaderSource from "./glsl-generated/textFragmentShader.ts";
import { bindToScreen } from "../../core/screen.ts";
import type { CWText } from "./CWText.ts";
import { WebglRenderer } from "../WebglRenderer.ts";

export class TextRenderer {
	private readonly webgl: WebglRenderer;

	private readonly texLengthUniformLocation: WebGLUniformLocation | null;

	private readonly scaleBufferId: WebGLBuffer;
	private readonly textLeftTopBufferId: WebGLBuffer;
	private readonly glyphIndexBufferId: WebGLBuffer;
	private readonly glyphVertexBufferId: WebGLBuffer;
	private readonly texIndexBufferId: WebGLBuffer;

	private readonly expandingTexture: ExpandingGlyphTexture;
	private readonly graphemeToGlyphMap: Map<string, number>;

	constructor() {
		// Get the glyph texture and grapheme map
		this.expandingTexture = new ExpandingGlyphTexture();
		this.graphemeToGlyphMap = new Map();

		// Create the WebglRenderer
		this.webgl = new WebglRenderer(textVertexShaderSource, textFragmentShaderSource);

		// Grab locations
		const glyphBoundingBoxLocation = this.webgl.uniformLocation("u_glyph_bounding_box");
		const screenUniformLocation = this.webgl.uniformLocation("u_screen");
		this.texLengthUniformLocation = this.webgl.uniformLocation("u_tex_length");

		const scaleAttributeLocation = this.webgl.attributeLocation("a_scale");
		const textTopLeftAttributeLocation = this.webgl.attributeLocation("a_text_top_left");
		const glyphIndexAttributeLocation = this.webgl.attributeLocation("a_glyph_index");
		const glyphVertexAttributeLocation = this.webgl.attributeLocation("a_glyph_vertex");
		const texIndexAttributeLocation = this.webgl.attributeLocation("a_tex_index");

		// Create buffers
		this.scaleBufferId = this.webgl.newBuffer();
		this.textLeftTopBufferId = this.webgl.newBuffer();
		this.glyphIndexBufferId = this.webgl.newBuffer();
		this.glyphVertexBufferId = this.webgl.newBuffer();
		this.texIndexBufferId = this.webgl.newBuffer();

		// Set/bind the uniforms
		this.gl.uniform2f(
			glyphBoundingBoxLocation,
			this.expandingTexture.glyphBoundingBox.right,
			this.expandingTexture.glyphBoundingBox.bottom);
		bindToScreen(screenValue => this.gl.uniform2f(
			screenUniformLocation, screenValue.width, screenValue.height));

		// Set the attributes
		assignBuffer(this.gl, this.scaleBufferId, scaleAttributeLocation, 1);
		assignBuffer(this.gl, this.textLeftTopBufferId, textTopLeftAttributeLocation, 2);
		assignBuffer(this.gl, this.glyphIndexBufferId, glyphIndexAttributeLocation, 1);
		assignBuffer(this.gl, this.glyphVertexBufferId, glyphVertexAttributeLocation, 2);
		assignBuffer(this.gl, this.texIndexBufferId, texIndexAttributeLocation, 2);

		// Create texture buffer
		const texture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

		// Set parameters so we can render correctly
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
	}

	async renderText(text: CWText) {
		// Split text into graphemes
		const graphemes = text.message.split("");

		// Find all graphemes we have never rendered before and update the texture if needed
		const newGraphemes = new Set(graphemes.filter(grapheme => !this.graphemeToGlyphMap.has(grapheme)));
		if (newGraphemes.size > 0) {
			// Add them all to the glyph texture and map
			for (const grapheme of newGraphemes) {
				const index = this.expandingTexture.addGrapheme(grapheme);
				this.graphemeToGlyphMap.set(grapheme, index);
			}

			// Upload the new texture
			const texture = await this.expandingTexture.getTexture();
			this.gl.texImage2D(
				this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture);

			// Set the texture size uniform
			this.gl.uniform1f(this.texLengthUniformLocation, this.graphemeToGlyphMap.size);
		}

		// Set the scale attribute
		const scales = graphemes.flatMap(() => {
			return [
				text.scale,
				text.scale,
				text.scale,
				text.scale,
				text.scale,
				text.scale
			];
		});
		setData(this.gl, this.scaleBufferId, scales);

		// Set the text left top attribute
		const textLeftTops = graphemes.flatMap(() => {
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
		});
		setData(this.gl, this.textLeftTopBufferId, textLeftTops);

		// Set the glyph index attribute
		const glyphIndices = graphemes.flatMap((_grapheme, index) => {
			return [
				index,
				index,
				index,
				index,
				index,
				index
			];
		});
		setData(this.gl, this.glyphIndexBufferId, glyphIndices);

		// Set the glyph vertex attribute
		const glyphVertices = graphemes.flatMap(() => {
			return [
				0, 0,
				1, 0,
				0, 1,
				0, 1,
				1, 0,
				1, 1
			];
		});
		setData(this.gl, this.glyphVertexBufferId, glyphVertices);

		// Set the texture index attribute
		const textureIndices = graphemes.flatMap(grapheme => {
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
		});
		setData(this.gl, this.texIndexBufferId, textureIndices);

		// Draw the triangles!
		this.gl.drawArrays(this.gl.TRIANGLES, 0, graphemes.length*6);
	}
}
