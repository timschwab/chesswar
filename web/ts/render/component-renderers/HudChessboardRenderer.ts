import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { ChessPieceRenderer } from "../../webgl/chessPiece/ChessPieceRenderer.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";
import { ChessboardHelper } from "./helpers/ChessboardHelper.ts";

const boardSize = 200;
const leftTop = new Point(10, 70);
const rightBottom = leftTop.add(new Point(boardSize, boardSize));
const boardRect = new Rect(leftTop, rightBottom);

export class HudChessboardRenderer implements UiComponentRenderer {
	private readonly chessboardHelper: ChessboardHelper;
	
	constructor(rectangleRenderer: RectangleRenderer, chessPieceRenderer: ChessPieceRenderer) {
		this.chessboardHelper = new ChessboardHelper(rectangleRenderer, chessPieceRenderer, boardRect);
	}

	render(state: ChesswarState) {
		state.getSelfPlayer().ifPresent(selfPlayer => {
			state.getTeamInfo().ifPresent(info => {
				this.chessboardHelper.renderBoard(info.board, [], selfPlayer.team);
			});
		});
	}
};
