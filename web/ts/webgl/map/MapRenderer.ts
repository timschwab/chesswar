import mapVertexShader from "./glsl-generated/mapVertexShader.ts";
import mapFragmentShader from "./glsl-generated/mapFragmentShader.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { bindToScreen } from "../../core/screen.ts";
import { WebglRenderer } from "../WebglRenderer.ts";

const SCREEN = "u_screen";
const CAMERA_CENTER = "u_camera_center";

const SCALE = "a_scale";
const VERTEX = "a_vertex";
const STRUCTURE_CENTER = "a_structure_center";
const COLOR = "a_color";

export class MapRenderer {
	private readonly renderer: WebglRenderer;

	constructor() {
		// Prepare the map rendering data
		const attributeValueData = new Map([
			[SCALE, []]
		]);

		const attributePointData = new Map([
			[VERTEX, []],
			[STRUCTURE_CENTER, []]
		]);

		const attributeColorData = new Map([
			[COLOR, []]
		]);

		// Create the renderer
		this.renderer = new WebglRenderer(
			mapVertexShader, mapFragmentShader,
			[], [SCREEN, CAMERA_CENTER], [],
			attributeValueData, attributePointData, attributeColorData
		);

		// Bind the screen size to the screen uniform
		bindToScreen(screenValue => this.renderer.setUniformPoint(SCREEN, screenValue.rightBottom));
	}

	render(camera: Point): void {
		// Set the camera once per render
		this.renderer.setUniformPoint(CAMERA_CENTER, camera);

		// Draw
		this.renderer.draw();
	}
}
