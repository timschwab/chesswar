import { Victory } from "../../../../common/data-types/base.ts";
import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { ZeroPoint } from "../../../../common/shapes/Zero.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { TextRenderer } from "../../webgl/text/TextRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";

const VICTORY_FONT_SIZE = 0.875;
const NEW_GAME_FONT_SIZE = 0.375;

export class VictoryRenderer implements UiComponentRenderer {
    private readonly textRenderer: TextRenderer;
    private readonly screen: CWScreen;

    constructor(textRenderer: TextRenderer, screen: CWScreen) {
        this.textRenderer = textRenderer;
        this.screen = screen;
    }

    render(state: ChesswarState) {
        // Useful values
        const victoryState = state.getVictory();
        const glyphBoundingBox = this.textRenderer.getGlyphBoundingBox();
        const screen = this.screen.get();

        // Early return
        if (victoryState === null) {
            return;
        }

        // Victory text
        const victoryMessage = this.victoryMessage(victoryState);
        const firstVictoryText = new CWText(victoryMessage, ZeroPoint, VICTORY_FONT_SIZE, rensets.victory.color);
        const victoryBoundingBox = firstVictoryText.getRect(glyphBoundingBox);

        const victoryTextLeft = screen.center.x-(victoryBoundingBox.width/2);
		const victoryTextTop = screen.center.y-(victoryBoundingBox.height/2);
        const victoryText = new CWText(
            victoryMessage,
            new Point(victoryTextLeft, victoryTextTop),
            VICTORY_FONT_SIZE,
            rensets.victory.color);

        // New game ticks
        const newGameMessage = "New game in: " + state.getNewGameCounter();
        const firstNewGameText = new CWText(newGameMessage, ZeroPoint, NEW_GAME_FONT_SIZE, rensets.victory.color);
        const newGameBoundingBox = firstNewGameText.getRect(glyphBoundingBox);

        const newGameTextLeft = screen.center.x-(newGameBoundingBox.width/2);
        const newGameTextTop = screen.bottom-(newGameBoundingBox.height);
        const newGameText = new CWText(
            newGameMessage,
            new Point(newGameTextLeft, newGameTextTop),
            NEW_GAME_FONT_SIZE,
            rensets.victory.color);
        
        this.textRenderer.render([victoryText, newGameText]);
    }

    private victoryMessage(victory: Victory): string {
        switch (victory) {
            case null:
                return "";
            case "tie":
                return "It's a tie!";
            default:
                return "Team " + victory + " wins!";
        }
    }
}
