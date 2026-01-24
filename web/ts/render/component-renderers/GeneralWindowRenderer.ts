import { PlayerRole } from "../../../../common/data-types/base.ts";
import { BriefingName } from "../../../../common/data-types/facility.ts";
import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { ZeroRect } from "../../../../common/shapes/Zero.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { ClientPlayer } from "../../game-logic/ClientPlayer.ts";
import { ChessPieceRenderer } from "../../webgl/chessPiece/ChessPieceRenderer.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";
import { ChessboardHelper } from "./ChessboardHelper.ts";

interface ImportantValuesBundle {
    windowRect: Rect,
    boardRect: Rect,
    [BriefingName.ONE]: Rect,
    [BriefingName.TWO]: Rect,
    [BriefingName.THREE]: Rect
}

export class GeneralWindowRenderer implements UiComponentRenderer {
    private rectangleRenderer: RectangleRenderer;
    private chessboardHelper: ChessboardHelper;
    private cachedImportantValues: ImportantValuesBundle | null = null;

    constructor(rectangleRenderer: RectangleRenderer, chessPieceRenderer: ChessPieceRenderer, screen: CWScreen) {
        this.rectangleRenderer = rectangleRenderer;
        this.chessboardHelper = new ChessboardHelper(rectangleRenderer, chessPieceRenderer, ZeroRect);
        screen.subscribe(screenValue => {
            this.cachedImportantValues = this.getImportantValues(screenValue);
            this.chessboardHelper.updateBoardRect(this.cachedImportantValues.boardRect);
        });
    }

    getImportantValues(screenRect: Rect): ImportantValuesBundle {
        const genwin = rensets.generalWindow;

        const padding = genwin.padding;
        const squareSize = genwin.squareSize;
        const buttonSize = genwin.buttonSize;

        const boardSize = squareSize*8;
        const windowWidth = padding + boardSize + padding + buttonSize + padding;
        const windowHeight = padding + boardSize + padding;

        const middleX = screenRect.width/2;
        const middleY = screenRect.height/2;

        const topLeftX = middleX - windowWidth/2;
        const topLeftY = middleY - windowHeight/2;
        const bottomRightX = middleX + windowWidth/2;
        const bottomRightY = middleY + windowHeight/2;

        const windowRectRaw = new Rect(new Point(topLeftX, topLeftY), new Point(bottomRightX, bottomRightY));
        const windowRect = windowRectRaw.floor();

        const boardTopLeftX = topLeftX + padding;
        const boardTopLeftY = topLeftY + padding;
        const boardRect = new Rect(new Point(boardTopLeftX, boardTopLeftY), new Point(topLeftX+boardSize+padding, topLeftY+boardSize+padding));

        const buttonX = topLeftX + padding + boardSize + padding;
        const button1Y = topLeftY + padding;
        const button2Y = middleY - buttonSize/2;
        const button3Y = bottomRightY - padding - buttonSize;

        const button1Rect = new Rect(new Point(buttonX, button1Y), new Point(buttonX+buttonSize, button1Y+buttonSize));
        const button2Rect = new Rect(new Point(buttonX, button2Y), new Point(buttonX+buttonSize, button2Y+buttonSize));
        const button3Rect = new Rect(new Point(buttonX, button3Y), new Point(buttonX+buttonSize, button3Y+buttonSize));

        return {
            windowRect,
            boardRect,
            [BriefingName.ONE]: button1Rect,
            [BriefingName.TWO]: button2Rect,
            [BriefingName.THREE]: button3Rect
        }
    }

    render(state: ChesswarState) {
        state.getSelfPlayer().ifPresent(selfPlayer => {
            if (selfPlayer.role === PlayerRole.GENERAL) {
                if (this.cachedImportantValues !== null) {
                    this.renderGeneralWindow(state, selfPlayer, this.cachedImportantValues);
                }
            }
        })
    }

    private renderGeneralWindow(state: ChesswarState, selfPlayer: ClientPlayer, importantValues: ImportantValuesBundle) {
        const genwin = rensets.generalWindow;
        const team = selfPlayer.team;

        // Make window
        const innerWindow = Shape.from(importantValues.windowRect, genwin.windowInside);
        const outerWindow = Shape.from(importantValues.windowRect.expand(5), genwin.windowOutline);

        // Make buttons
        const button1 = Shape.from(importantValues[BriefingName.ONE], genwin.button);
        const button2 = Shape.from(importantValues[BriefingName.TWO], genwin.button);
        const button3 = Shape.from(importantValues[BriefingName.THREE], genwin.button);

        // Make selected button
        const briefingSelection = state.getGeneralSelectedButton().map(
            button => Shape.from(importantValues[button].expand(3), genwin.teamColor[team]));

        // Draw all shapes
        const shapes = [
            outerWindow, innerWindow,
            button1, button2, button3
        ];
        briefingSelection.ifPresent(selection => shapes.push(selection));
        this.rectangleRenderer.render(shapes);

        // Draw board
        state.getTeamInfo().ifPresent(info => this.chessboardHelper.renderBoard(info.board));
    }
}
