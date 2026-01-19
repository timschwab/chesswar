import { CWColor } from "../../../../common/Color.ts";
import { ChessBoard, SquareColor } from "../../../../common/data-types/chess.ts";
import { assertNever } from "../../../../common/Preconditions.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";

const squareSize = 20;
const boardOutlineColor = CWColor.GREY_BLACK;
const boardOutlineWidth = 2;
const boardLight = CWColor.GREY_LIGHT;
const boardDark = CWColor.GREY_DARK;

const boardSize = squareSize*8;
const leftTop = new Point(10, 100);
const rightBottom = leftTop.add(new Point(boardSize, boardSize));
const boardRect = new Rect(leftTop, rightBottom);

export class HudChessboardRenderer {
	private readonly rectangleRenderer: RectangleRenderer;
	
	constructor(rectangleRenderer: RectangleRenderer) {
		this.rectangleRenderer = rectangleRenderer;
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
	}
};
