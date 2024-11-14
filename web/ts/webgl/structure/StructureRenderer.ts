import structureVertexShaderSource from "./glsl-generated/structureVertexShader.ts";
import structureFragmentShaderSource from "./glsl-generated/structureFragmentShader.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { bindToScreen } from "../../core/screen.ts";

export class StructureRenderer {
	private readonly webgl: WebglRenderer;

	private readonly cameraUniformLocation: WebGLUniformLocation;

	private readonly scaleBufferId: WebGLBuffer;
	private readonly structureCenterBufferId: WebGLBuffer;
	private readonly vertexBufferId: WebGLBuffer;
	private readonly colorBufferId: WebGLBuffer;

	private vertexCount: number = 0;

	constructor() {
		// Create the WebglRenderer
		this.webgl = new WebglRenderer(structureVertexShaderSource, structureFragmentShaderSource);

		// Grab uniform locations
		const screenUniformLocation = this.webgl.uniformLocation("u_screen");
		this.cameraUniformLocation = this.webgl.uniformLocation("u_camera_center");

		// Set/bind the uniforms
		bindToScreen(screenValue => this.webgl.setUniformPoint(
			screenUniformLocation, screenValue.rightBottom));

		// Get attribute buffers
		this.scaleBufferId = this.webgl.attributeBuffer("a_scale", 1);
		this.structureCenterBufferId = this.webgl.attributeBuffer("a_structure_center", 2);
		this.vertexBufferId = this.webgl.attributeBuffer("a_vertex", 2);
		this.colorBufferId = this.webgl.attributeBuffer("a_color", 3);
	}

	setCamera(camera: Point): void {
		// Set the camera uniform
		this.webgl.setUniformPoint(this.cameraUniformLocation, camera);
	}

	setStructures(structures: Structure[]): void {
		// Some quick pre-processing to separate attributes
		const triangleScales = structures.flatMap(struct => struct.triangles.flatMap(triangle => [
			triangle.scale,
			triangle.scale,
			triangle.scale,
		]));

		const triangleStructureCenters = structures.flatMap(struct => struct.triangles.flatMap(triangle => [
			triangle.reference.x, triangle.reference.y,
			triangle.reference.x, triangle.reference.y,
			triangle.reference.x, triangle.reference.y
		]));

		const triangleVertices = structures.flatMap(struct => struct.triangles.flatMap(triangle => [
			triangle.v1.x, triangle.v1.y,
			triangle.v2.x, triangle.v2.y,
			triangle.v3.x, triangle.v3.y
		]));

		const triangleColors = structures.flatMap(struct => [
			struct.color.r, struct.color.g, struct.color.b,
			struct.color.r, struct.color.g, struct.color.b,
			struct.color.r, struct.color.g, struct.color.b
		]);

		// Load the data
		this.webgl.setAttributeData(this.scaleBufferId, triangleScales);
		this.webgl.setAttributeData(this.structureCenterBufferId, triangleStructureCenters);
		this.webgl.setAttributeData(this.vertexBufferId, triangleVertices);
		this.webgl.setAttributeData(this.colorBufferId, triangleColors);

		// Store the vertex count
		this.vertexCount = triangleScales.length;
	}

	render(): void {
		this.webgl.draw(this.vertexCount);
	}
}
