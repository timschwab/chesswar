import rectangleVertexShader from "./glsl-generated/rectangleVertexShader.ts";
import rectangleFragmentShader from "./glsl-generated/rectangleFragmentShader.ts";

import { Point } from "../../../../common/shapes/Point.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";

const SCREEN = "u_screen";
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
			[], [LEFT_TOP, RIGHT_BOT], [COLOR],
			new Map(), attributeDataMap, new Map(),
			SCREEN
		);
	}

	render(rectangles: Shape<Rect>[]) {
		rectangles.forEach(rectangle => {
			// Set each rectangle left top, right bottom, and color
			this.renderer.setUniformPoint(LEFT_TOP, rectangle.geo.leftTop);
			this.renderer.setUniformPoint(RIGHT_BOT, rectangle.geo.rightBottom);
			this.renderer.setUniformColor(COLOR, rectangle.settings.color);

			// Draw
			this.renderer.draw();
		});
	}
}
