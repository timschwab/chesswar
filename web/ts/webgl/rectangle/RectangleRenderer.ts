import rectangleVertexShader from "./glsl-generated/rectangleVertexShader.ts";
import rectangleFragmentShader from "./glsl-generated/rectangleFragmentShader.ts";

import { Point } from "../../../../common/shapes/Point.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { Dom } from "../../core/Dom.ts";

const SCREEN = "u_screen";
const LEFT_TOP = "u_left_top";
const RIGHT_BOT = "u_right_bot";
const COLOR = "u_color";

const VERTEX = "a_vertex";

// A class for rendering rectangles
export class RectangleRenderer {
	private readonly renderer: WebglRenderer;

	constructor(dom: Dom) {
		// Prepare the rectangle rendering data
		const rectangleData = [
			new Point(0, 0), new Point(0, 1), new Point(1, 0),
			                 new Point(0, 1), new Point(1, 0), new Point(1, 1)
		];
		const attributePointData = new Map([[VERTEX, rectangleData]]);

		// Create the renderer
		this.renderer = new WebglRenderer(dom, {
			shaderSource: {
				vertex: rectangleVertexShader,
				fragment: rectangleFragmentShader
			},
			uniformNames: {
				screen: SCREEN,
				points: [LEFT_TOP, RIGHT_BOT],
				colors: [COLOR]
			},
			attributeData: {
				points: attributePointData
			}
		});
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
