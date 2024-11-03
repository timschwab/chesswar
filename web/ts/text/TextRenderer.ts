import { getAttachedCanvas } from "../core/dom.ts";
import { ExpandingTextTexture } from "./ExpandingTextTexture.ts";
import { assignBuffer, createProgram, createShader, getGl, makeBuffer, setData } from "../webgl/webglUtils.ts";
import textVertexShaderSource from "./webgl/generated/textVertexShader.ts";
import textFragmentShaderSource from "./webgl/generated/textFragmentShader.ts";
import { screenValue } from "../core/screen.ts";

export class TextRenderer {
	private readonly gl: WebGLRenderingContext;
	private readonly expandingTexture: ExpandingTextTexture;

	constructor() {
		// Get the text texture
		this.expandingTexture = new ExpandingTextTexture();
		this.expandingTexture.addLetter("A");
		this.expandingTexture.addLetter("B");

		// Get the real canvas we will use WebGL on
		const canvas = getAttachedCanvas();
		canvas.width = screenValue.width;
		canvas.height = screenValue.height;
		this.gl = getGl(canvas);

		// Build the 2 shaders and link them into a program
		const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, textVertexShaderSource);
		const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, textFragmentShaderSource);
		const program = createProgram(this.gl, vertexShader, fragmentShader);
		this.gl.useProgram(program);

		// Grab locations
		const screenUniformLocation = this.gl.getUniformLocation(program, "u_screen");

		const screenPositionAttributeLocation = this.gl.getAttribLocation(program, "a_screen_position");
		const texPositionAttributeLocation = this.gl.getAttribLocation(program, "a_tex_position");

		// Create buffers
		const screenPositionBufferId = makeBuffer(this.gl);
		const texPositionBufferId = makeBuffer(this.gl);

		// Set the uniform
		this.gl.uniform2f(screenUniformLocation, screenValue.width, screenValue.height);

		// Set the attributes
		assignBuffer(this.gl, screenPositionBufferId, screenPositionAttributeLocation, 2);
		assignBuffer(this.gl, texPositionBufferId, texPositionAttributeLocation, 2);

		// Load the attributes
		const w = this.expandingTexture.letterBoundingBox.width;
		const h = this.expandingTexture.letterBoundingBox.height;
		setData(this.gl, screenPositionBufferId, [
			w*0, 0,
			w*1, 0,
			w*0, h,
			w*0, h,
			w*1, 0,
			w*1, h,

			w*1, 0,
			w*2, 0,
			w*1, h,
			w*1, h,
			w*2, 0,
			w*2, h,
		]);

		setData(this.gl, texPositionBufferId, [
			0.0, 0.0,
			0.5, 0.0,
			0.0, 1.0,
			0.0, 1.0,
			0.5, 0.0,
			0.5, 1.0,

			0.5, 0.0,
			1.0, 0.0,
			0.5, 1.0,
			0.5, 1.0,
			1.0, 0.0,
			1.0, 1.0
		]);

		// Create texture buffer
		const texture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

		// Set the parameters so we can render any size image.
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
	}

	async renderText(_text: string) {
		// Upload the image into the texture.
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			0,
			this.gl.RGBA,
			this.gl.RGBA,
			this.gl.UNSIGNED_BYTE,
			await this.expandingTexture.getTexture());

		// Draw the triangles
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 12);
	}
}
