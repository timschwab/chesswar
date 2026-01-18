import chessboardVertexShader from "./glsl-generated/chessboardVertexShader.ts";
import chessboardFragmentShader from "./glsl-generated/chessboardFragmentShader.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { WebglInterface } from "../WebglInterface.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { ChessSquare } from "../../../../common/data-types/chess.ts";

const SCREEN = "u_screen";
const LEFT_TOP = "u_left_top";
const SCALE = "u_scale";

const VERTEX = "a_vertex";

export class ChessPieceRenderer {
	private readonly renderer: WebglRenderer;

	constructor(webgl: WebglInterface, screen: CWScreen) {
		// Prepare the rendering data
		const rectangleData = [
			new Point(0, 0), new Point(0, 1), new Point(1, 0),
							 new Point(0, 1), new Point(1, 0), new Point(1, 1)
		];
		const attributePointData = new Map([[VERTEX, rectangleData]]);

		// Create the renderer
		this.renderer = new WebglRenderer(webgl, screen, {
			shaderSource: {
				vertex: chessVertexShader,
				fragment: chessFragmentShader
			},
			uniformNames: {
				screen: SCREEN,
				points: [LEFT_TOP, SCALE],
				colors: []
			},
			attributeData: {
				points: attributePointData
			}
		});
	}

	renderSquare(board: Rect, square: ChessSquare): void {
		// Set uniforms
		// Set scale
		// Set left top
		// Set piece index
		// Set piece color

		// Draw
		this.renderer.draw();
	}
}
