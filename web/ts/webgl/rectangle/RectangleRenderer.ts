import rectangleVertexShader from "./glsl-generated/rectangleVertexShader.ts";
import rectangleFragmentShader from "./glsl-generated/rectangleFragmentShader.ts";

import { Point } from "../../../../common/shapes/Point.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { bindToScreen } from "../../core/screen.ts";

const SCREEN = "u_screen";
const CAMERA_CENTER = "u_camera_center";
const LEFT_TOP = "u_left_top";
const RIGHT_BOT = "u_right_bot";
const COLOR = "u_color";

const VERTEX = "a_vertex";

// A class for rendering rectangles
export class RectangleRenderer {
	private readonly renderer: WebglRenderer;

	constructor() {
		// Prepare the player rendering data
		const rectangleData = [new Point(0, 0), new Point(1, 1)];
		const attributeDataMap = new Map([[VERTEX, rectangleData]]);

		// Create the renderer
		this.renderer = new WebglRenderer(
			rectangleVertexShader, rectangleFragmentShader,
			[], [SCREEN, CAMERA_CENTER, LEFT_TOP, RIGHT_BOT], [COLOR],
			new Map(), attributeDataMap, new Map()
		);

		// Bind the screen size to the screen uniform
		bindToScreen(screenValue => this.renderer.setUniformPoint(SCREEN, screenValue.rightBottom));
	}
}
