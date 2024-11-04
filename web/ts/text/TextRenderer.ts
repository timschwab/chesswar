import { getAttachedCanvas } from "../core/dom.ts";
import { ExpandingGlyphTexture } from "./ExpandingGlyphTexture.ts";
import { assignBuffer, createProgram, createShader, getGl, makeBuffer, setData } from "../webgl/webglUtils.ts";
import textVertexShaderSource from "./webgl/generated/textVertexShader.ts";
import textFragmentShaderSource from "./webgl/generated/textFragmentShader.ts";
import { bindCanvasToScreen, bindToScreen } from "../core/screen.ts";
import type { CWText } from "./CWText.ts";

export class TextRenderer {
	private readonly gl: WebGLRenderingContext;
	private readonly texLengthUniformLocation: WebGLUniformLocation | null;

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

		// Get the canvas we will render to
		const canvas = getAttachedCanvas();
		bindCanvasToScreen(canvas);
		this.gl = getGl(canvas);

		// Build the 2 shaders and link them into a program
		const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, textVertexShaderSource);
		const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, textFragmentShaderSource);
		const program = createProgram(this.gl, vertexShader, fragmentShader);
		this.gl.useProgram(program);

		// Grab locations
		const glyphBoundingBoxLocation = this.gl.getUniformLocation(program, "u_glyph_bounding_box");
		const screenUniformLocation = this.gl.getUniformLocation(program, "u_screen");
		this.texLengthUniformLocation = this.gl.getUniformLocation(program, "u_tex_length");

		const textTopLeftAttributeLocation = this.gl.getAttribLocation(program, "a_text_top_left");
		const glyphIndexAttributeLocation = this.gl.getAttribLocation(program, "a_glyph_index");
		const glyphVertexAttributeLocation = this.gl.getAttribLocation(program, "a_glyph_vertex");
		const texIndexAttributeLocation = this.gl.getAttribLocation(program, "a_tex_index");

		// Create buffers
		this.textLeftTopBufferId = makeBuffer(this.gl);
		this.glyphIndexBufferId = makeBuffer(this.gl);
		this.glyphVertexBufferId = makeBuffer(this.gl);
		this.texIndexBufferId = makeBuffer(this.gl);

		// Set/bind the uniforms
		this.gl.uniform2f(
			glyphBoundingBoxLocation,
			this.expandingTexture.glyphBoundingBox.right,
			this.expandingTexture.glyphBoundingBox.bottom);
		bindToScreen(screenValue => this.gl.uniform2f(
			screenUniformLocation, screenValue.width, screenValue.height));

		// Set the attributes
		assignBuffer(this.gl, this.textLeftTopBufferId, textTopLeftAttributeLocation, 2);
		assignBuffer(this.gl, this.glyphIndexBufferId, glyphIndexAttributeLocation, 1);
		assignBuffer(this.gl, this.glyphVertexBufferId, glyphVertexAttributeLocation, 2);
		assignBuffer(this.gl, this.texIndexBufferId, texIndexAttributeLocation, 2);

		// Create texture buffer
		const texture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

		// Set the parameters so we can render any size image.
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
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
