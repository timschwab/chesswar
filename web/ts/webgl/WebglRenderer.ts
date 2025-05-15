import { Color } from "../../../common/Color.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { WEBGL_CONSTANTS, WebglInterface } from "./WebglInterface.ts";


// A class for working with a specific program
export class WebglRenderer {
	private readonly webgl: WebglInterface;
	private readonly uniformValueLocations: Map<string, WebGLUniformLocation>;
	private readonly uniformPointLocations: Map<string, WebGLUniformLocation>;
	private readonly uniformColorLocations: Map<string, WebGLUniformLocation>;
	private readonly vertexCount: number;

	constructor(
		vertexShaderSource: string, fragmentShaderSource: string,
		uniformValueNames: string[], uniformPointNames: string[], uniformColorNames: string[],
		attributePointData: Map<string, Point[]>
	) {
		this.vertexCount = this.getVertexCount(attributePointData);

		this.webgl = new WebglInterface();
		const program = this.compileProgram(vertexShaderSource, fragmentShaderSource);

		this.uniformValueLocations = this.mapUniformLocations(program, uniformValueNames);
		this.uniformPointLocations = this.mapUniformLocations(program, uniformPointNames);
		this.uniformColorLocations = this.mapUniformLocations(program, uniformColorNames);

		this.setAttributePointData(program, attributePointData);
	}

	private getVertexCount(attributePointData: Map<string, Point[]>): number {
		return attributePointData
			.entries()
			.map(entry => entry[1].length)
			.reduce((prev, cur) => {
				if (prev === cur) {
					return cur;
				} else {
					throw "Not all attribute point data is the same length";
				}
		});
	}

	// Build the 2 shaders and link them into a program
	private compileProgram(vertexShaderSource: string, fragmentShaderSource: string) {
		const vertexShader = this.webgl.createShader(WEBGL_CONSTANTS.VERTEX_SHADER);
		this.webgl.shaderSource(vertexShader, vertexShaderSource);
		this.webgl.compileShader(vertexShader);

		const fragmentShader = this.webgl.createShader(WEBGL_CONSTANTS.FRAGMENT_SHADER);
		this.webgl.shaderSource(vertexShader, fragmentShaderSource);
		this.webgl.compileShader(fragmentShader);

		const program = this.webgl.createProgram();
		this.webgl.attachShader(program, vertexShader);
		this.webgl.attachShader(program, fragmentShader);
		this.webgl.linkProgram(program);
		this.webgl.useProgram(program);

		return program;
	}

	// Map the uniform names to locations
	private mapUniformLocations(program: WebGLProgram, names: string[]): Map<string, WebGLUniformLocation> {
		return new Map(names.map(name => [name, this.webgl.getAttribLocation(program, name)]));
	}

	// Get the attribute location, bind a new buffer, and set the data
	private setAttributePointData(program: WebGLProgram, attributePointData: Map<string, Point[]>): void {
		for (const [attributeName, attributeData] of attributePointData.entries()) {
			// Prepare the buffer
			const location = this.webgl.getAttribLocation(program, attributeName);
			const bufferId = this.webgl.createBuffer();
			this.webgl.bindBuffer(bufferId);
			this.webgl.enableVertexAttribArray(location);
			this.webgl.vertexAttribPointer(location, 2);

			// Set the data in the buffer
			const listOfNums = attributeData.flatMap(point => [point.x, point.y]);
			const floatArray = new Float32Array(listOfNums);
			this.webgl.bufferData(floatArray);
		}
	}

	// For actual use
	setUniformValue(name: string, value: number) {
		const location = this.uniformValueLocations.get(name);
		if (location === undefined) {
			throw "Location could not be found: " + name
		}
		this.webgl.setUniformValue(location, value);
	}

	setUniformPoint(name: string, point: Point) {
		const location = this.uniformPointLocations.get(name);
		if (location === undefined) {
			throw "Location could not be found: " + name
		}
		this.webgl.setUniformPoint(location, point);
	}

	setUniformColor(name: string, color: Color) {
		const location = this.uniformColorLocations.get(name);
		if (location === undefined) {
			throw "Location could not be found: " + name
		}
		this.webgl.setUniformColor(location, color);
	}

	draw(): void {
		this.webgl.draw(this.vertexCount);
	}
}
