import { CarryLoadType } from "../../../../common/data-types/carryLoad.ts";
import { briefingBundleMoveList } from "../../../../common/data-types/facility.ts";
import { assertNever } from "../../../../common/Preconditions.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { ChessPieceRenderer } from "../../webgl/chessPiece/ChessPieceRenderer.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";
import { ChessboardHelper } from "./ChessboardHelper.ts";

const boardSize = 200;
const leftTop = new Point(10, 290);
const rightBottom = leftTop.add(new Point(boardSize, boardSize));
const boardRect = new Rect(leftTop, rightBottom);

export class CarryingChessboardRenderer implements UiComponentRenderer {
    private readonly chessboardHelper: ChessboardHelper;
    
    constructor(rectangleRenderer: RectangleRenderer, chessPieceRenderer: ChessPieceRenderer) {
        this.chessboardHelper = new ChessboardHelper(rectangleRenderer, chessPieceRenderer, boardRect);
    }

    render(state: ChesswarState) {
        state.getTeamInfo().ifPresent(info => {
            const carrying = state.getCarrying();
            const teamBoard = info.board;

            switch (carrying.type) {
                case CarryLoadType.EMPTY:
                    break;
                case CarryLoadType.ORDERS:
                    this.chessboardHelper.renderBoard(teamBoard, [carrying.load]);
                    break;
                case CarryLoadType.INTEL:
                    this.chessboardHelper.renderBoard(carrying.load, []);
                    break;
                case CarryLoadType.ESPIONAGE:
                    this.chessboardHelper.renderBoard(teamBoard, briefingBundleMoveList(carrying.load));
                    break;
                default:
                    assertNever(carrying);
            }
        });
    }
};
