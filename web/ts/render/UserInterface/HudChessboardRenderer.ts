import { ChessBoard } from "../../../../common/data-types/chess.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { ChessPieceRenderer } from "../../webgl/chessPiece/ChessPieceRenderer.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";
import { ChessboardHelper } from "./ChessboardHelper.ts";

const boardSize = 200;
const leftTop = new Point(10, 70);
const rightBottom = leftTop.add(new Point(boardSize, boardSize));
const boardRect = new Rect(leftTop, rightBottom);

export class HudChessboardRenderer {
	private readonly chessboardHelper: ChessboardHelper;
	
	constructor(rectangleRenderer: RectangleRenderer, chessPieceRenderer: ChessPieceRenderer) {
		this.chessboardHelper = new ChessboardHelper(rectangleRenderer, chessPieceRenderer, boardRect);
	}

	render(boardData: ChessBoard) {
		this.chessboardHelper.renderBoard(boardData);
	}
};
