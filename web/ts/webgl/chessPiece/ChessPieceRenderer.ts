import chessPieceVertexShader from "./glsl-generated/chessPieceVertexShader.ts";
import chessPieceFragmentShader from "./glsl-generated/chessPieceFragmentShader.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { WebglInterface } from "../WebglInterface.ts";
import { ChessOwnedPiece, ChessPiece } from "../../../../common/data-types/chess.ts";
import { rensets } from "../../../../common/settings.ts";
import { chessPieceData } from "./ChessPieceData.ts";
import { objectEntries } from "../../../../common/typescript-utils.ts";

const SCREEN = "u_screen";
const SCALE = "u_scale";
const LEFT_TOP = "u_left_top";
const COLOR = "u_color";

const VERTEX = "a_vertex";

export class ChessPieceRenderer {
	private readonly renderer: WebglRenderer;
	private readonly pieceMappings;

	constructor(webgl: WebglInterface, screen: CWScreen) {
		// Prepare the rendering data
		const initial = {
			index: 0 as number,
			mappings: {} as Record<ChessPiece, {
				start: number,
				length: number
			}>,
			data: [] as Point[]
		};

		this.pieceMappings = objectEntries(chessPieceData).reduce((acc, cur) => {
			const [piece, points] = cur;
			acc.mappings[piece] = {
				start: acc.index,
				length: points.length
			};
			acc.data = acc.data.concat(points);
			acc.index += points.length;
			return acc;
		}, initial);

		const attributePointData = new Map([[VERTEX, this.pieceMappings.data]]);

		// Create the renderer
		this.renderer = new WebglRenderer(webgl, screen, {
			shaderSource: {
				vertex: chessPieceVertexShader,
				fragment: chessPieceFragmentShader
			},
			uniformNames: {
				screen: SCREEN,
				values: [SCALE],
				points: [LEFT_TOP],
				colors: [COLOR]
			},
			attributeData: {
				points: attributePointData
			}
		});
	}

	renderSquare(leftTop: Point, scale: number, piece: ChessOwnedPiece): void {
		this.renderer.prep();

		// Set uniforms
		this.renderer.setUniformValue(SCALE, scale);
		this.renderer.setUniformPoint(LEFT_TOP, leftTop);
		this.renderer.setUniformColor(COLOR, rensets.players.teamColor[piece.team]);
		
		// Draw just the triangles we want to draw
		const info = this.pieceMappings.mappings[piece.piece];
		this.renderer.drawCustom(info.start, info.length);
	}
}
