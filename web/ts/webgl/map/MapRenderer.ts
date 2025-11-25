import mapVertexShader from "./glsl-generated/mapVertexShader.ts";
import mapFragmentShader from "./glsl-generated/mapFragmentShader.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { mapStructures } from "../../../../common/map/MapValues.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { WebglInterface } from "../WebglInterface.ts";

const SCREEN = "u_screen";
const CAMERA_CENTER = "u_camera_center";

const SCALE = "a_scale";
const VERTEX = "a_vertex";
const STRUCTURE_CENTER = "a_structure_center";
const COLOR = "a_color";

export class MapRenderer {
	private readonly renderer: WebglRenderer;

	constructor(webgl: WebglInterface, screen: CWScreen) {
		// Prepare the map rendering data
		const scaleValues = mapStructures.flatMap(struct => struct.triangles.flatMap(
			tri => [tri.scale, tri.scale, tri.scale]));
		const vertexPoints = mapStructures.flatMap(struct => struct.triangles.flatMap(
			tri => [tri.v1, tri.v2, tri.v3]));
		const centerPoints = mapStructures.flatMap(struct => struct.triangles.flatMap(
			tri => [tri.reference, tri.reference, tri.reference]));
		const colors = mapStructures.flatMap(struct => struct.triangles.flatMap(
			_tri => [struct.color, struct.color, struct.color]));

		const attributeValueData = new Map([
			[SCALE, scaleValues]
		]);

		const attributePointData = new Map([
			[VERTEX, vertexPoints],
			[STRUCTURE_CENTER, centerPoints]
		]);

		const attributeColorData = new Map([
			[COLOR, colors]
		]);

		// Create the renderer
		this.renderer = new WebglRenderer(webgl, screen, {
			shaderSource: {
				vertex: mapVertexShader,
				fragment: mapFragmentShader
			},
			uniformNames: {
				screen: SCREEN,
				points: [CAMERA_CENTER]
			},
			attributeData: {
				values: attributeValueData,
				points: attributePointData,
				colors: attributeColorData
			}
		});
	}

	render(camera: Point): void {
		// Set the camera once per render
		this.renderer.setUniformPoint(CAMERA_CENTER, camera);

		// Draw
		this.renderer.draw();
	}
}
