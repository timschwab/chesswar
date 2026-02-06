import { PlayerRole } from "../../../../common/data-types/base.ts";
import { ChessMove } from "../../../../common/data-types/chess.ts";
import { BriefingName } from "../../../../common/data-types/facility.ts";
import { rensets } from "../../../../common/settings.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { ZeroRect } from "../../../../common/shapes/Zero.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { ClientPlayer } from "../../game-logic/ClientPlayer.ts";
import { ChessPieceRenderer } from "../../webgl/chessPiece/ChessPieceRenderer.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";
import { ChessboardHelper } from "./helpers/ChessboardHelper.ts";
import { GeneralWindowHelper, ImportantValuesBundle } from "./helpers/GeneralWindowHelper.ts";

export class GeneralWindowRenderer implements UiComponentRenderer {
    private rectangleRenderer: RectangleRenderer;
    private chessboardHelper: ChessboardHelper;
    private genwinHelper: GeneralWindowHelper;

    constructor(rectangleRenderer: RectangleRenderer, chessPieceRenderer: ChessPieceRenderer, screen: CWScreen) {
        this.rectangleRenderer = rectangleRenderer;
        this.chessboardHelper = new ChessboardHelper(rectangleRenderer, chessPieceRenderer, ZeroRect);
        this.genwinHelper = new GeneralWindowHelper(screen);
    }

    render(state: ChesswarState) {
        state.getSelfPlayer().ifPresent(selfPlayer => {
            if (selfPlayer.role === PlayerRole.GENERAL) {
                this.genwinHelper.getImportantValues().ifPresent(
                    importantValues => this.renderGeneralWindow(state, selfPlayer, importantValues));
            }
        })
    }

    private renderGeneralWindow(state: ChesswarState, selfPlayer: ClientPlayer, importantValues: ImportantValuesBundle) {
        const genwin = rensets.generalWindow;
        const team = selfPlayer.team;
        this.chessboardHelper.updateBoardRect(importantValues.boardRect);

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
        briefingSelection.ifPresent(selection => shapes.splice(2, 0, selection));
        this.rectangleRenderer.render(shapes);

        // Draw board
        state.getTeamInfo().ifPresent(info => {
            const moves: ChessMove[] = [];
            if (info.briefings[BriefingName.ONE] !== null) moves.push(info.briefings[BriefingName.ONE]);
            if (info.briefings[BriefingName.TWO] !== null) moves.push(info.briefings[BriefingName.TWO]);
            if (info.briefings[BriefingName.THREE] !== null) moves.push(info.briefings[BriefingName.THREE]);
            this.chessboardHelper.renderBoard(info.board, moves)
        });
    }
}
