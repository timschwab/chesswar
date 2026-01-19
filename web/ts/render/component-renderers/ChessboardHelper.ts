import { CWColor } from "../../../../common/Color.ts";
import { ChessBoard, SquareColor } from "../../../../common/data-types/chess.ts";
import { assertNever } from "../../../../common/Preconditions.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { ChessPieceRenderer } from "../../webgl/chessPiece/ChessPieceRenderer.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";

const boardOutlineColor = CWColor.GREY_BLACK;
const boardOutlineWidth = 2;
const boardLight = CWColor.GREY_LIGHT;
const boardDark = CWColor.GREY_STANDARD;

export class ChessboardHelper {
    private readonly rectangleRenderer: RectangleRenderer;
    private readonly chessPieceRenderer: ChessPieceRenderer;
	private readonly boardRect: Rect;
	private readonly squareSize: number;

    constructor(rectangleRenderer: RectangleRenderer, chessPieceRenderer: ChessPieceRenderer, boardRect: Rect) {
        this.rectangleRenderer = rectangleRenderer;
        this.chessPieceRenderer = chessPieceRenderer;
		this.boardRect = boardRect;
		this.squareSize = boardRect.width/8;
    }

    renderBoard(boardData: ChessBoard) {
        // Prep and draw all rectangles
		const border = Shape.from(this.boardRect.expand(boardOutlineWidth), boardOutlineColor);
		const squares = boardData.flatMap(row => {
			return row.map(square => {
				const squareLeftTop = this.boardRect.leftTop.add(new Point(square.coordinate.file*this.squareSize, square.coordinate.rank*this.squareSize));
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
					const squareLeftTop = this.boardRect.leftTop.add(new Point(square.coordinate.file*this.squareSize, square.coordinate.rank*this.squareSize));
					this.chessPieceRenderer.renderSquare(squareLeftTop, this.squareSize, square.contents);
				}
			})
		});
    }
}
