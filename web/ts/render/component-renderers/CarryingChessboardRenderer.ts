import { TeamName } from "../../../../common/data-types/base.ts";
import { CarryLoad, CarryLoadType } from "../../../../common/data-types/carryLoad.ts";
import { ChessBoard } from "../../../../common/data-types/chess.ts";
import { briefingBundleMoveList } from "../../../../common/data-types/facility.ts";
import { assertNever } from "../../../../common/Preconditions.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { ChessPieceRenderer } from "../../webgl/chessPiece/ChessPieceRenderer.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";
import { ChessboardHelper } from "./helpers/ChessboardHelper.ts";

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
        state.getSelfPlayer().ifPresent(selfPlayer => {
            state.getTeamInfo().ifPresent(teamInfo => {
                this.renderInternal(selfPlayer.team, teamInfo.board, state.getCarrying());
            });
        });
    }

    private renderInternal(team: TeamName, teamBoard: ChessBoard, carrying: CarryLoad) {
        switch (carrying.type) {
            case CarryLoadType.EMPTY:
                break;
            case CarryLoadType.ORDERS:
                this.chessboardHelper.renderBoard(teamBoard, [carrying.load], team);
                break;
            case CarryLoadType.INTEL:
                this.chessboardHelper.renderBoard(carrying.load, [], team);
                break;
            case CarryLoadType.ESPIONAGE:
                this.chessboardHelper.renderBoard(teamBoard, briefingBundleMoveList(carrying.load), team);
                break;
            default:
                assertNever(carrying);
        }
    }
};
