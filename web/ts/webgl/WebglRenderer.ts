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
		if (webgl == null) {
			throw "This browser does not support WebGL";
		}
		return webgl;
	}

	private createShader(type: ShaderType, source: string): WebGLShader {
		const shader = this.webgl.createShader(type);
		if (shader == null) {
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
		if (program == null) {
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

	// Initialization methods
	uniformLocation(name: string): WebGLUniformLocation {
		const location = this.webgl.getUniformLocation(this.program, name);
		if (location === null) {
			throw "Could not find uniform location: " + name;
		} else {
			return location;
		}
	}

	attributeLocation(name: string): GLint {
		const location = this.webgl.getAttribLocation(this.program, name);
		if (location === null) {
			throw "Could not find attribute location: " + name;
		} else {
			return location;
		}
	}

	newBuffer(): WebGLBuffer {
		const bufferId = this.webgl.createBuffer();
		if (bufferId == null) {
			throw "Couldn't make a new buffer";
		}
		return bufferId;
	}

	// Rendering methods
}
