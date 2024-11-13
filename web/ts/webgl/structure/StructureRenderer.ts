import structureVertexShaderSource from "./glsl-generated/structureVertexShader.ts";
import structureFragmentShaderSource from "./glsl-generated/structureFragmentShader.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { Point } from "../../../../common/shapes/Point.ts";

export class StructureRenderer {
	private readonly webgl: WebglRenderer;

	constructor() {
		// Create the WebglRenderer
		this.webgl = new WebglRenderer(structureVertexShaderSource, structureFragmentShaderSource);
	}

	renderStructures(structures: Structure[], camera: Point) {
		//
	}
}
