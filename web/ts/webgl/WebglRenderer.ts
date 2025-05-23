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
		attributeValueData: Map<string, number[]>, attributePointData: Map<string, Point[]>, attributeColorData: Map<string, Color[]>
	) {
		// Get and check the attribute vertex count
		this.vertexCount = this.getVertexCount(attributeValueData, attributePointData, attributeColorData);

		// Start up webgl
		this.webgl = new WebglInterface();
		const program = this.compileProgram(vertexShaderSource, fragmentShaderSource);

		// Get the uniform locations
		this.uniformValueLocations = this.mapUniformLocations(program, uniformValueNames);
		this.uniformPointLocations = this.mapUniformLocations(program, uniformPointNames);
		this.uniformColorLocations = this.mapUniformLocations(program, uniformColorNames);

		// Set the attribute data
		this.setAttributeValueData(program, attributeValueData);
		this.setAttributePointData(program, attributePointData);
		this.setAttributeColorData(program, attributeColorData);
	}

	// Get and check the attribute vertex count
	private getVertexCount(attributeValueData: Map<string, number[]>, attributePointData: Map<string, Point[]>, attributeColorData: Map<string, Color[]>): number {
		const valueCount = this.getAttributeMapCount(attributeValueData);
		const pointCount = this.getAttributeMapCount(attributePointData);
		const colorCount = this.getAttributeMapCount(attributeColorData);
		if (valueCount === pointCount && pointCount === colorCount) {
			return valueCount;
		} else {
			throw "Not all attribute data has the same vertex count";
		}
	}

	private getAttributeMapCount(attributeData: Map<string, unknown[]>): number {
		return attributeData
			.entries()
			.map(entry => entry[1].length)
			.reduce((prev, cur) => {
				if (prev === cur) {
					return cur;
				} else {
					throw "Not all attribute data is the same length";
				}
		});
	}

	// Build the 2 shaders and link them into a program
	private compileProgram(vertexShaderSource: string, fragmentShaderSource: string) {
		const vertexShader = this.webgl.createShader(WEBGL_CONSTANTS.VERTEX_SHADER);
		this.webgl.shaderSource(vertexShader, vertexShaderSource);
		this.webgl.compileShader(vertexShader);

		const fragmentShader = this.webgl.createShader(WEBGL_CONSTANTS.FRAGMENT_SHADER);
		this.webgl.shaderSource(fragmentShader, fragmentShaderSource);
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
		return new Map(names.map(name => [name, this.webgl.getUniformLocation(program, name)]));
	}

	// Setting attribute data
	private setAttributeValueData(program: WebGLProgram, attributePointData: Map<string, number[]>): void {
		for (const [attributeName, attributeData] of attributePointData.entries()) {
			// Prepare the buffer
			this.prepBuffer(program, attributeName, 1);

			// Set the data in the buffer
			const floatArray = new Float32Array(attributeData);
			this.webgl.bufferData(floatArray);
		}
	}

	private setAttributePointData(program: WebGLProgram, attributePointData: Map<string, Point[]>): void {
		for (const [attributeName, attributeData] of attributePointData.entries()) {
			// Prepare the buffer
			this.prepBuffer(program, attributeName, 2);

			// Set the data in the buffer
			const listOfNums = attributeData.flatMap(point => [point.x, point.y]);
			const floatArray = new Float32Array(listOfNums);
			this.webgl.bufferData(floatArray);
		}
	}

	private setAttributeColorData(program: WebGLProgram, attributePointData: Map<string, Color[]>): void {
		for (const [attributeName, attributeData] of attributePointData.entries()) {
			// Prepare the buffer
			this.prepBuffer(program, attributeName, 3);

			// Set the data in the buffer
			const listOfNums = attributeData.flatMap(color => [color.r, color.g, color.b]);
			const floatArray = new Float32Array(listOfNums);
			this.webgl.bufferData(floatArray);
		}
	}

	private prepBuffer(program: WebGLProgram, attributeName: string, dataSize: number) {
		const location = this.webgl.getAttribLocation(program, attributeName);
		const bufferId = this.webgl.createBuffer();
		this.webgl.bindBuffer(bufferId);
		this.webgl.enableVertexAttribArray(location);
		this.webgl.vertexAttribPointer(location, dataSize);
	}

	// User facing methods
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
