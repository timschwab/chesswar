import { CWColor } from "../../../../common/Color.ts";
import { ChessBoard, SquareColor } from "../../../../common/data-types/chess.ts";
import { assertNever } from "../../../../common/Preconditions.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { ChessPieceRenderer } from "../../webgl/chessPiece/ChessPieceRenderer.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";

const squareSize = 25;
const boardOutlineColor = CWColor.GREY_BLACK;
const boardOutlineWidth = 2;
const boardLight = CWColor.GREY_LIGHT;
const boardDark = CWColor.GREY_STANDARD;

const boardSize = squareSize*8;
const leftTop = new Point(10, 70);
const rightBottom = leftTop.add(new Point(boardSize, boardSize));
const boardRect = new Rect(leftTop, rightBottom);

export class HudChessboardRenderer {
	private readonly rectangleRenderer: RectangleRenderer;
	private readonly chessPieceRenderer: ChessPieceRenderer;
	
	constructor(rectangleRenderer: RectangleRenderer, chessPieceRenderer: ChessPieceRenderer) {
		this.rectangleRenderer = rectangleRenderer;
		this.chessPieceRenderer = chessPieceRenderer;
	}

	render(boardData: ChessBoard) {
		// Prep and draw all rectangles
		const border = Shape.from(boardRect.expand(boardOutlineWidth), boardOutlineColor);
		const squares = boardData.flatMap(row => {
			return row.map(square => {
				const squareLeftTop = leftTop.add(new Point(square.coordinate.file*squareSize, square.coordinate.rank*squareSize));
				const squareRightBottom = squareLeftTop.add(new Point(squareSize, squareSize));
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
					const squareLeftTop = leftTop.add(new Point(square.coordinate.file*squareSize, square.coordinate.rank*squareSize));
					this.chessPieceRenderer.renderSquare(squareLeftTop, squareSize, square.contents);
				}
			})
		});
	}
};
