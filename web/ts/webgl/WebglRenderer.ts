import { Color } from "../../../common/Color.ts";
import { Optional } from "../../../common/data-structures/Optional.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Dom } from "../core/Dom.ts";
import { bindToScreen } from "../core/screen.ts";
import { WEBGL_CONSTANTS, WebglInterface } from "./WebglInterface.ts";
import { makeStrict, WebGlRendererSettings } from "./WebglRendererSettings.ts";


// A class for working with a specific program
export class WebglRenderer {
	private readonly webgl: WebglInterface;
	private readonly uniformValueLocations: Map<string, WebGLUniformLocation>;
	private readonly uniformPointLocations: Map<string, WebGLUniformLocation>;
	private readonly uniformColorLocations: Map<string, WebGLUniformLocation>;
	private readonly vertexCount: number;

	constructor(dom: Dom, rawSettings: WebGlRendererSettings) {
		const settings = makeStrict(rawSettings);

		// Get and check the attribute vertex count
		this.vertexCount = this.getVertexCount(settings.attributeData.values, settings.attributeData.points, settings.attributeData.colors);

		// Start up webgl
		this.webgl = new WebglInterface(dom);
		const program = this.compileProgram(settings.shaderSource.vertex, settings.shaderSource.fragment);

		// Get the uniform locations
		this.uniformValueLocations = this.mapUniformLocations(program, settings.uniformNames.values);
		this.uniformPointLocations = this.mapUniformLocations(program, settings.uniformNames.points);
		this.uniformColorLocations = this.mapUniformLocations(program, settings.uniformNames.colors);

		// Set the attribute data
		this.setAttributeValueData(program, settings.attributeData.values);
		this.setAttributePointData(program, settings.attributeData.points);
		this.setAttributeColorData(program, settings.attributeData.colors);

		// If given a screen uniform, automatically set it when the screen size changes
		if (settings.uniformNames.screen !== null) {
			const screenUniformLocation = this.webgl.getUniformLocation(program, settings.uniformNames.screen);
			bindToScreen(screenValue => this.webgl.setUniformPoint(screenUniformLocation, screenValue.rightBottom));
		}
	}

	// Get and check the attribute vertex count
	private getVertexCount(attributeValueData: Map<string, number[]>, attributePointData: Map<string, Point[]>, attributeColorData: Map<string, Color[]>): number {
		const valueCount = this.getAttributeMapCount(attributeValueData);
		const pointCount = this.getAttributeMapCount(attributePointData);
		const colorCount = this.getAttributeMapCount(attributeColorData);

		const consolidatedCount = [valueCount, pointCount, colorCount].reduce((prev, cur) => {
			if (prev.isEmpty()) {
				return cur;
			} else if (cur.isEmpty()) {
				return prev;
			} else if (prev.get() === cur.get()) {
				return cur;
			} else {
				throw "Not all attribute data maps had the same size";
			}
		}, Optional.empty());

		if (consolidatedCount.isPresent()) {
			return consolidatedCount.get();
		} else {
			throw "No attribute data was given";
		}
	}

	private getAttributeMapCount(attributeData: Map<string, unknown[]>): Optional<number> {
		if (attributeData.size === 0) {
			return Optional.empty();
		} else {
			return Optional.of(attributeData
				.entries()
				.map(entry => entry[1].length)
				.reduce((prev, cur) => {
					if (prev === cur) {
						return cur;
					} else {
						throw "Not all attribute data is the same length";
					}
			}));
		}
	}

	// Build the 2 shaders and link them into a program
	private compileProgram(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {
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

	private prepBuffer(program: WebGLProgram, attributeName: string, dataSize: number): void {
		const location = this.webgl.getAttribLocation(program, attributeName);
		const bufferId = this.webgl.createBuffer();
		this.webgl.bindBuffer(bufferId);
		this.webgl.enableVertexAttribArray(location);
		this.webgl.vertexAttribPointer(location, dataSize);
	}

	// User facing methods
	setUniformValue(name: string, value: number): void {
		const location = this.uniformValueLocations.get(name);
		if (location === undefined) {
			throw "Location could not be found: " + name
		}
		this.webgl.setUniformValue(location, value);
	}

	setUniformPoint(name: string, point: Point): void {
		const location = this.uniformPointLocations.get(name);
		if (location === undefined) {
			throw "Location could not be found: " + name
		}
		this.webgl.setUniformPoint(location, point);
	}

	setUniformColor(name: string, color: Color): void {
		const location = this.uniformColorLocations.get(name);
		if (location === undefined) {
			throw "Location could not be found: " + name
		}
		this.webgl.setUniformColor(location, color);
	}

	createTexture(): void {
		const texture = this.webgl.createTexture();
		this.webgl.bindTexture(texture);

		// Currently just used by the text renderer
		this.webgl.textureParameter(WEBGL_CONSTANTS.TEXTURE_2D, WEBGL_CONSTANTS.TEXTURE_WRAP_S, WEBGL_CONSTANTS.CLAMP_TO_EDGE);
		this.webgl.textureParameter(WEBGL_CONSTANTS.TEXTURE_2D, WEBGL_CONSTANTS.TEXTURE_WRAP_T, WEBGL_CONSTANTS.CLAMP_TO_EDGE);
		this.webgl.textureParameter(WEBGL_CONSTANTS.TEXTURE_2D, WEBGL_CONSTANTS.TEXTURE_MIN_FILTER, WEBGL_CONSTANTS.LINEAR);
	}

	// This is an expensive call
	setTextureData(texture: TexImageSource): void {
		this.webgl.setTextureData(texture);
	}

	draw(): void {
		this.webgl.draw(this.vertexCount);
	}
}
