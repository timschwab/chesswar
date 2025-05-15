import { Color } from "../../../common/Color.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { getAttachedCanvas } from "../core/dom.ts";
import { bindCanvasToScreen, bindToScreen } from "../core/screen.ts";


type ShaderType = WebGLRenderingContext["VERTEX_SHADER"] | WebGLRenderingContext["FRAGMENT_SHADER"];

export const WEBGL_CONSTANTS = {
	VERTEX_SHADER: WebGLRenderingContext["VERTEX_SHADER"],
	FRAGMENT_SHADER: WebGLRenderingContext["FRAGMENT_SHADER"]
};

// A class that makes it easier to work with webgl. Does very little other than wrapping the calls and
// checking that every call is a success, which should be true in prod 99.9% of the time.
export class WebglInterface {
	private readonly webgl: WebGLRenderingContext;

	constructor() {
		// Get the canvas we will render to
		const canvas = getAttachedCanvas();
		bindCanvasToScreen(canvas);
		this.webgl = this.getWebgl(canvas);
		bindToScreen(screenValue => this.webgl.viewport(0, 0, screenValue.width, screenValue.height));
	}

	/***** Helper function for the constructor *****/
	private getWebgl(canvas: HTMLCanvasElement): WebGLRenderingContext {
		const webgl = canvas.getContext("webgl");
		if (webgl === null) {
			throw "This browser does not support WebGL";
		}
		return webgl;
	}

	/***** Functions for building the program *****/
	createShader(type: ShaderType): WebGLShader {
		const shader = this.webgl.createShader(type);
		if (shader === null) {
			throw "Couldn't create a shader";
		}
		return shader;
	}

	shaderSource(shader: WebGLShader, source: string) {
		this.webgl.shaderSource(shader, source);
	}

	compileShader(shader: WebGLShader) {
		this.webgl.compileShader(shader);
		const success = this.webgl.getShaderParameter(shader, this.webgl.COMPILE_STATUS);
		if (success) {
			return shader;
		} else {
			console.error(this.webgl.getShaderInfoLog(shader));
			this.webgl.deleteShader(shader);
			throw "Couldn't compile shader";
		}
	}

	createProgram(): WebGLProgram {
		const program = this.webgl.createProgram();
		if (program === null) {
			throw "Couldn't create program";
		}
		return program;
	}

	attachShader(program: WebGLProgram, shader: WebGLShader) {
		this.webgl.attachShader(program, shader);
	}

	linkProgram(program: WebGLProgram) {
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

	useProgram(program: WebGLProgram): void {
		this.webgl.useProgram(program);
	}

	/***** Functions for getting locations *****/
	getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation {
		const location = this.webgl.getUniformLocation(program, name);
		if (location === null) {
			throw "Could not find uniform location: " + name;
		}
		return location;
	}

	getAttribLocation(program: WebGLProgram, name: string): GLint {
		const location = this.webgl.getAttribLocation(program, name);
		if (location === null) {
			throw "Could not find attribute location: " + name;
		}
		return location;
	}

	/***** Functions for working with attributes *****/
	createBuffer(): WebGLBuffer {
		const bufferId = this.webgl.createBuffer();
		if (bufferId === null) {
			throw "Couldn't make a new buffer";
		}
		return bufferId;
	}

	bindBuffer(bufferId: WebGLBuffer): void {
		this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, bufferId);
	}

	enableVertexAttribArray(location: GLint): void {
		this.webgl.enableVertexAttribArray(location);
	}

	// A complex function. Tell the attribute how to get data out of the buffer.
	vertexAttribPointer(location: GLint, size: number): void {
		// location                    // the attribute location
		// size                        // the number of floats per vertex (value=1, point=2, color=3, etc)
		const type = this.webgl.FLOAT; // the data is 32bit floats
		const normalize = false;       // don't normalize the data
		const stride = 0;              // 0 = move forward size * sizeof(type) each iteration to get the next position
		const attribOffset = 0;        // start at the beginning of the buffer
		this.webgl.vertexAttribPointer(location, size, type, normalize, stride, attribOffset);
	}

	// Warning: this is an expensive call
	bufferData(data: Float32Array): void {
		this.webgl.bufferData(this.webgl.ARRAY_BUFFER, data, this.webgl.DYNAMIC_DRAW);
	}

	/***** Functions for working with uniforms *****/
	setUniformValue(location: WebGLUniformLocation, value: number): void {
		this.webgl.uniform1f(location, value);
	}

	setUniformPoint(location: WebGLUniformLocation, point: Point): void {
		this.webgl.uniform2f(location, point.x, point.y);
	}

	setUniformColor(location: WebGLUniformLocation, color: Color): void {
		this.webgl.uniform3f(location, color.r, color.g, color.b);
	}

	/***** The draw function *****/
	draw(vertexCount: number): void {
		this.webgl.drawArrays(this.webgl.TRIANGLES, 0, vertexCount);
	}
}
