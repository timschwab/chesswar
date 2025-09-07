import chessboardVertexShader from "./glsl-generated/chessboardVertexShader.ts";
import chessboardFragmentShader from "./glsl-generated/chessboardFragmentShader.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { rensets } from "../../../../common/settings.ts";
import { Dom } from "../../core/Dom.ts";

const SCALE = "u_scale";
const SCREEN = "u_screen";
const LEFT_TOP = "u_left_top";

const VERTEX = "a_vertex";
const COLOR = "a_color";

export class ChessboardRenderer {
	private readonly renderer: WebglRenderer;

	constructor(dom: Dom) {
		// Prepare the chessboard rendering data
		const unitSquare = [
			new Point(0, 0), new Point(0, 1), new Point(1, 0),
			new Point(1, 1), new Point(0, 1), new Point(1, 0)
		];

		const vertexPoints = new Array(64).fill(null).flatMap((_val, index) => {
			const delta = new Point(index % 8, Math.floor(index / 8));
			return unitSquare.map(point => point.add(delta));
		});

		const colors = new Array(64).fill(null).flatMap((_val, index) => {
			const isLight = ((index + Math.floor(index/8)) % 2) === 0;
			return unitSquare.map(_point => isLight ? rensets.generalWindow.boardLight : rensets.generalWindow.boardDark);
		});

		const attributePointData = new Map([
			[VERTEX, vertexPoints]
		]);

		const attributeColorData = new Map([
			[COLOR, colors]
		]);

		// Create the renderer
		this.renderer = new WebglRenderer(dom, {
			shaderSource: {
				vertex: chessboardVertexShader,
				fragment: chessboardFragmentShader
			},
			uniformNames: {
				screen: SCREEN,
				values: [SCALE],
				points: [LEFT_TOP]
			},
			attributeData: {
				points: attributePointData,
				colors: attributeColorData
			}
		});
	}

	render(leftTop: Point, size: number): void {
		// Set the left-top and size
		this.renderer.setUniformValue(SCALE, size);
		this.renderer.setUniformPoint(LEFT_TOP, leftTop);

		// Draw
		this.renderer.draw();
	}
}
