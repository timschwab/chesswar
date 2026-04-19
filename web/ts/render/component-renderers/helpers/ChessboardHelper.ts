import { Color, CWColor } from "../../../../../common/Color.ts";
import { TAU_QUARTER } from "../../../../../common/Constants.ts";
import { TeamName } from "../../../../../common/data-types/base.ts";
import { applyPerspective, ChessBoard, ChessMove, SquareColor, teamPerspective } from "../../../../../common/data-types/chess.ts";
import { assertNever } from "../../../../../common/Preconditions.ts";
import { rensets } from "../../../../../common/settings.ts";
import { Point } from "../../../../../common/shapes/Point.ts";
import { Rect } from "../../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../../common/shapes/Shape.ts";
import { Vector } from "../../../../../common/shapes/Vector.ts";
import { ChessPieceRenderer } from "../../../webgl/chessPiece/ChessPieceRenderer.ts";
import { RectangleRenderer } from "../../../webgl/rectangle/RectangleRenderer.ts";
import { TriangleRenderer } from "../../../webgl/triangle/TriangleRenderer.ts";

const boardOutlineColor = CWColor.GREY_BLACK;
const boardOutlineWidth = 2;
const boardLight = CWColor.GREY_LIGHT;
const boardDark = CWColor.GREY_STANDARD;

export class ChessboardHelper {
    private readonly rectangleRenderer: RectangleRenderer;
    private readonly chessPieceRenderer: ChessPieceRenderer;
	private readonly triangleRenderer: TriangleRenderer;
	private boardRect: Rect;
	private squareSize: number;

    constructor(rectangleRenderer: RectangleRenderer, chessPieceRenderer: ChessPieceRenderer, triangleRenderer: TriangleRenderer, boardRect: Rect) {
        this.rectangleRenderer = rectangleRenderer;
        this.chessPieceRenderer = chessPieceRenderer;
		this.triangleRenderer = triangleRenderer;
		this.boardRect = boardRect;
		this.squareSize = boardRect.width/8;
    }

	updateBoardRect(boardRect: Rect) {
		this.boardRect = boardRect;
		this.squareSize = boardRect.width/8;
	}

    renderBoard(boardData: ChessBoard, moves: ChessMove[], team: TeamName) {
		const perspective = teamPerspective(team);

        // Prep and draw all rectangles
		const border = Shape.from(this.boardRect.expand(boardOutlineWidth), boardOutlineColor);
		const squares = boardData.flatMap(row => {
			return row.map(square => {
				const coordinate = applyPerspective(square.coordinate, perspective);
				const squareLeftTop = this.boardRect.leftTop.add(new Point(coordinate.file*this.squareSize, coordinate.rank*this.squareSize));
				const squareRightBottom = squareLeftTop.add(new Point(this.squareSize, this.squareSize));
				const rect = new Rect(squareLeftTop, squareRightBottom);
				switch (square.color) {
					case SquareColor.LIGHT:
						return Shape.from(rect, boardLight);
					case SquareColor.DARK:
						return Shape.from(rect, boardDark);
					default:
						assertNever(square.color);
				}
			});
		});
		this.rectangleRenderer.render([border, ...squares]);

		// Draw all the pieces
		boardData.forEach(row => {
			row.forEach(square => {
				if (square.contents !== null) {
					const coordinate = applyPerspective(square.coordinate, perspective);
					const squareLeftTop = this.boardRect.leftTop.add(new Point(coordinate.file*this.squareSize, coordinate.rank*this.squareSize));
					this.chessPieceRenderer.renderSquare(squareLeftTop, this.squareSize, square.contents);
				}
			})
		});

		// Draw all the moves
		moves.forEach(move => {
			const from = applyPerspective(move.from, perspective);
			const to = applyPerspective(move.to, perspective);
			const color = rensets.players.teamColor[move.team];
			const fromSquare = new Rect(
				this.boardRect.leftTop.add(new Point(from.file*this.squareSize, from.rank*this.squareSize)),
				this.boardRect.leftTop.add(new Point((from.file+1)*this.squareSize, (from.rank+1)*this.squareSize))
			);
			const toSquare = new Rect(
				this.boardRect.leftTop.add(new Point(to.file*this.squareSize, to.rank*this.squareSize)),
				this.boardRect.leftTop.add(new Point((to.file+1)*this.squareSize, (to.rank+1)*this.squareSize))
			);

			const arrowHalfWidth = this.squareSize/8;
			const fromPoint = fromSquare.center;
			const toPoint = toSquare.center;
			const vector = Vector.fromPoints(fromPoint, toPoint);
			const v1 = vector.clockwise(TAU_QUARTER).withMagnitude(arrowHalfWidth).toPoint().add(fromPoint);
			const v2 = vector.counterClockwise(TAU_QUARTER).withMagnitude(arrowHalfWidth).toPoint().add(fromPoint);

			const triangles: [Point, Point, Point, Color][] = [
				[v1, v2, toPoint, color]
			];
			
			this.triangleRenderer.render(triangles);
		});
    }
}
