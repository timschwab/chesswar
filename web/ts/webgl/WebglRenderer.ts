import { Point } from "../../../common/shapes/Point.ts";
import { getAttachedCanvas } from "../core/dom.ts";
import { bindCanvasToScreen } from "../core/screen.ts";


type ShaderType = WebGLRenderingContext["VERTEX_SHADER"] | WebGLRenderingContext["FRAGMENT_SHADER"];

// A class that makes it easier to work with webgl. Does very little other than wrapping the calls.
export class WebglRenderer {
	private readonly webgl: WebGLRenderingContext;
	private readonly program: WebGLProgram;

	constructor(vertexShaderSource: string, fragmentShadeSource: string) {
		// Get the canvas we will render to
		const canvas = getAttachedCanvas();
		bindCanvasToScreen(canvas);
		this.webgl = this.getWebgl(canvas);

		// Build the 2 shaders and link them into a program
		const vertexShader = this.createShader(this.webgl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = this.createShader(this.webgl.FRAGMENT_SHADER, fragmentShadeSource);
		this.program = this.createProgram(vertexShader, fragmentShader);
		this.webgl.useProgram(this.program);
	}

	// Helper functions for the constructor
	private getWebgl(canvas: HTMLCanvasElement): WebGLRenderingContext {
		const webgl = canvas.getContext("webgl");
		if (webgl === null) {
			throw "This browser does not support WebGL";
		}
		return webgl;
	}

	private createShader(type: ShaderType, source: string): WebGLShader {
		const shader = this.webgl.createShader(type);
		if (shader === null) {
			throw "Couldn't create a shader";
		}

		this.webgl.shaderSource(shader, source);
		this.webgl.compileShader(shader);
		const success = this.webgl.getShaderParameter(shader, this.webgl.COMPILE_STATUS);
		if (success) {
			return shader;
		} else {
			console.log(this.webgl.getShaderInfoLog(shader));
			this.webgl.deleteShader(shader);
			throw "Couldn't compile shader";
		}
	}

	private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
		const program = this.webgl.createProgram();
		if (program === null) {
			throw "Couldn't create program";
		}

		this.webgl.attachShader(program, vertexShader);
		this.webgl.attachShader(program, fragmentShader);
		this.webgl.linkProgram(program);
		const success = this.webgl.getProgramParameter(program, this.webgl.LINK_STATUS);
		if (success) {
			return program;
		} else {
			console.log(this.webgl.getProgramInfoLog(program));
			this.webgl.deleteProgram(program);
			throw "Couldn't link program";
		}
	}

	// Expose webgl for things like constants. Improvement would be to pull out the
	// constants into their own class.
	gl(): WebGLRenderingContext {
		return this.webgl;
	}

	// Initialization methods
	uniformLocation(name: string): WebGLUniformLocation {
		const location = this.webgl.getUniformLocation(this.program, name);
		if (location === null) {
			throw "Could not find uniform location: " + name;
		} else {
			return location;
		}
	}

	attributeBuffer(name: string, size: number): WebGLBuffer {
		// Get attribute location
		const location = this.webgl.getAttribLocation(this.program, name);
		if (location === null) {
			throw "Could not find attribute location: " + name;
		}

		// Create a new buffer for this attribute
		const bufferId = this.webgl.createBuffer();
		if (bufferId === null) {
			throw "Couldn't make a new buffer";
		}

		// Assign the buffer to the attribute
		this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, bufferId);
		this.webgl.enableVertexAttribArray(location);

		// Tell the attribute how to get data out of the buffer
		const type = this.webgl.FLOAT; // the data is 32bit floats
		const normalize = false;       // don't normalize the data
		const stride = 0;              // 0 = move forward size * sizeof(type) each iteration to get the next position
		const attribOffset = 0;        // start at the beginning of the buffer
		this.webgl.vertexAttribPointer(location, size, type, normalize, stride, attribOffset);

		return bufferId;
	}

	textureBuffer(): WebGLTexture {
		const texture = this.webgl.createTexture();
		if (texture === null) {
			throw "Could not create new texture";
		}

		this.webgl.bindTexture(this.webgl.TEXTURE_2D, texture);

		return texture;
	}

	textureParameter(target: GLenum, pname: GLenum, param: GLint): void {
		this.webgl.texParameteri(target, pname, param);
	}

	// Rendering methods
	setUniformValue(location: WebGLUniformLocation, value: number) {
		this.webgl.uniform1f(location, value);
	}

	setUniformPoint(location: WebGLUniformLocation, value: Point) {
		this.webgl.uniform2f(location, value.x, value.y);
	}

	setAttributeData(buffer: WebGLBuffer, data: number[]) {
		this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, buffer);
		this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Float32Array(data), this.webgl.STATIC_DRAW);
	}

	setTextureData(texture: TexImageSource) {
		this.webgl.texImage2D(
			this.webgl.TEXTURE_2D,
			0,
			this.webgl.RGBA,
			this.webgl.RGBA,
			this.webgl.UNSIGNED_BYTE,
			texture);
	}

	draw(vertexCount: number): void {
		this.webgl.drawArrays(this.webgl.TRIANGLES, 0, vertexCount);
	}
}
