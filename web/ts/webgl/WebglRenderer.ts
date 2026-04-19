import { Color } from "../../../common/Color.ts";
import { Optional } from "../../../common/data-structures/Optional.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { CWScreen } from "../core/CWScreen.ts";
import { WEBGL_CONSTANTS, WebglInterface } from "./WebglInterface.ts";
import { makeStrict, WebGlRendererSettings } from "./WebglRendererSettings.ts";


interface AttributePair {
	location: GLint,
	buffer: WebGLBuffer
}

// A class for working with a specific program
export class WebglRenderer {
	private readonly webgl: WebglInterface;
	private readonly uniformValueLocations: Map<string, WebGLUniformLocation>;
	private readonly uniformPointLocations: Map<string, WebGLUniformLocation>;
	private readonly uniformColorLocations: Map<string, WebGLUniformLocation>;
	private readonly attributeValuePairs: AttributePair[];
	private readonly attributePointPairs: AttributePair[];
	private readonly attributeColorPairs: AttributePair[];
	private readonly vertexCount: number;
	private readonly program: WebGLProgram;

	constructor(webgl: WebglInterface, screen: CWScreen, rawSettings: WebGlRendererSettings) {
		const settings = makeStrict(rawSettings);

		// Get and check the attribute vertex count
		this.vertexCount = this.getVertexCount(settings.attributeData.values, settings.attributeData.points, settings.attributeData.colors);

		// Start up webgl
		this.webgl = webgl;
		this.program = this.compileProgram(settings.shaderSource.vertex, settings.shaderSource.fragment);
		this.webgl.useProgram(this.program);

		// Get the uniform locations
		this.uniformValueLocations = this.mapUniformLocations(this.program, settings.uniformNames.values);
		this.uniformPointLocations = this.mapUniformLocations(this.program, settings.uniformNames.points);
		this.uniformColorLocations = this.mapUniformLocations(this.program, settings.uniformNames.colors);

		// Set the attribute data
		this.attributeValuePairs = this.mapAttributeValueData(this.program, settings.attributeData.values);
		this.attributePointPairs = this.mapAttributePointData(this.program, settings.attributeData.points);
		this.attributeColorPairs = this.mapAttributeColorData(this.program, settings.attributeData.colors);

		// If given a screen uniform, automatically set it when the screen size changes
		if (settings.uniformNames.screen !== null) {
			const screenUniformLocation = this.webgl.getUniformLocation(this.program, settings.uniformNames.screen);
			screen.subscribe(screenValue => {
				this.webgl.useProgram(this.program);
				this.webgl.setUniformPoint(screenUniformLocation, screenValue.rightBottom)
			});
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

		return program;
	}

	// Map the uniform names to locations
	private mapUniformLocations(program: WebGLProgram, names: string[]): Map<string, WebGLUniformLocation> {
		return new Map(names.map(name => [name, this.webgl.getUniformLocation(program, name)]));
	}

	// Setting attribute data
	private mapAttributeValueData(program: WebGLProgram, attributeValueData: Map<string, number[]>): AttributePair[] {
		return attributeValueData.entries().map(([attributeName, attributeData]) => {
			// Prepare the buffer
			const pair = this.attributePair(program, attributeName);

			// Set the data in the buffer
			const floatArray = new Float32Array(attributeData);
			this.webgl.bufferData(floatArray);

			return pair;
		}).toArray();
	}

	private mapAttributePointData(program: WebGLProgram, attributePointData: Map<string, Point[]>): AttributePair[] {
		return attributePointData.entries().map(([attributeName, attributeData]) => {
			// Prepare the buffer
			const pair = this.attributePair(program, attributeName);

			// Set the data in the buffer
			const listOfNums = attributeData.flatMap(point => [point.x, point.y]);
			const floatArray = new Float32Array(listOfNums);
			this.webgl.bufferData(floatArray);

			return pair;
		}).toArray();
	}

	private mapAttributeColorData(program: WebGLProgram, attributeColorData: Map<string, Color[]>): AttributePair[] {
		return attributeColorData.entries().map(([attributeName, attributeData]) => {
			// Prepare the buffer
			const pair = this.attributePair(program, attributeName);

			// Set the data in the buffer
			const listOfNums = attributeData.flatMap(color => [color.r, color.g, color.b]);
			const floatArray = new Float32Array(listOfNums);
			this.webgl.bufferData(floatArray);

			return pair;
		}).toArray();
	}

	private attributePair(program: WebGLProgram, attributeName: string): AttributePair {
		const location = this.webgl.getAttribLocation(program, attributeName);
		const buffer = this.webgl.createBuffer();
		this.webgl.bindBuffer(buffer);
		return {
			location,
			buffer
		};
	}

	// User facing methods
	prep() {
		this.webgl.useProgram(this.program);
		this.attributeValuePairs.forEach(pair => this.prepAttribute(pair, 1));
		this.attributePointPairs.forEach(pair => this.prepAttribute(pair, 2));
		this.attributeColorPairs.forEach(pair => this.prepAttribute(pair, 3));
	}

	private prepAttribute(pair: AttributePair, dataSize: number): void {
		this.webgl.bindBuffer(pair.buffer);
		this.webgl.enableVertexAttribArray(pair.location);
		this.webgl.vertexAttribPointer(pair.location, dataSize);
	}

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

	drawCustom(first: number, count: number): void {
		this.webgl.drawCustom(first, count);
	}
}
