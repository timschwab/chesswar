import triangleVertexShader from "./glsl-generated/triangleVertexShader.ts";
import triangleFragmentShader from "./glsl-generated/triangleFragmentShader.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { WebglInterface } from "../WebglInterface.ts";
import { Color } from "../../../../common/Color.ts";

const SCREEN = "u_screen";
const V1 = "u_v1";
const V2 = "u_v2";
const V3 = "u_v3";
const COLOR = "u_color"

const VERTEX = "a_vertex";

// A class for rendering triangles
export class TriangleRenderer {
	private readonly renderer: WebglRenderer;

	constructor(webgl: WebglInterface, screen: CWScreen) {
		// Prepare the triangle rendering data
		const triangleData = [
			new Point(1, 1), new Point(1, 0), new Point(0, 1)
		];
		const attributePointData = new Map([[VERTEX, triangleData]]);

		// Create the renderer
		this.renderer = new WebglRenderer(webgl, screen, {
			shaderSource: {
				vertex: triangleVertexShader,
				fragment: triangleFragmentShader
			},
			uniformNames: {
				screen: SCREEN,
				points: [V1, V2, V3],
				colors: [COLOR]
			},
			attributeData: {
				points: attributePointData
			}
		});
	}

	render(triangles: [Point, Point, Point, Color][]) {
		// Prepare webgl
		this.renderer.prep();

		// Draw each rectangle
		triangles.forEach(tri => {
			// Set each rectangle left top, right bottom, and color
			this.renderer.setUniformPoint(V1, tri[0]);
			this.renderer.setUniformPoint(V2, tri[1]);
			this.renderer.setUniformPoint(V3, tri[2]);
			this.renderer.setUniformColor(COLOR, tri[3]);

			// Draw
			this.renderer.draw();
		});
	}
}
