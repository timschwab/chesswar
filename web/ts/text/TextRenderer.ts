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
	private readonly screenPositionBufferId: WebGLBuffer;
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
		const screenUniformLocation = this.gl.getUniformLocation(program, "u_screen");
		this.texLengthUniformLocation = this.gl.getUniformLocation(program, "u_tex_length");

		const screenPositionAttributeLocation = this.gl.getAttribLocation(program, "a_screen_position");
		const texIndexAttributeLocation = this.gl.getAttribLocation(program, "a_tex_index");

		// Create buffers
		this.screenPositionBufferId = makeBuffer(this.gl);
		this.texIndexBufferId = makeBuffer(this.gl);

		// Bind the screen size uniform
		bindToScreen(screenValue => this.gl.uniform2f(
			screenUniformLocation, screenValue.width, screenValue.height));

		// Set the attributes
		assignBuffer(this.gl, this.screenPositionBufferId, screenPositionAttributeLocation, 2);
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

		// Set the vertex position attribute
		const w = this.expandingTexture.glyphBoundingBox.width;
		const h = this.expandingTexture.glyphBoundingBox.height;
		const screenVertices = graphemes.flatMap((_grapheme, index) => {
			const x0 = w*index;
			const x1 = w*(index+1);

			return [
				x0, 0,
				x1, 0,
				x0, h,
				x0, h,
				x1, 0,
				x1, h
			];
		});
		setData(this.gl, this.screenPositionBufferId, screenVertices);

		// Set the texture position attribute
		const textureVertices = graphemes.flatMap(grapheme => {
			const index = this.graphemeToGlyphMap.get(grapheme);
			if (index === undefined) {
				throw "Could not find grapheme in graphemeToGlyphMap: " + grapheme;
			}

			const x0 = index;
			const x1 = index+1;

			return [
				x0, 0,
				x1, 0,
				x0, 1,
				x0, 1,
				x1, 0,
				x1, 1
			];
		});
		setData(this.gl, this.texIndexBufferId, textureVertices);

		console.log(
			this.graphemeToGlyphMap.size,
			screenVertices,
			textureVertices
		);

		// Draw the triangles!
		this.gl.drawArrays(this.gl.TRIANGLES, 0, graphemes.length*6);
	}
}
