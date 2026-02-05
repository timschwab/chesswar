import { CWColor } from "../../../../common/Color.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { WebglPlayerRenderer } from "../../webgl/player/WebglPlayerRenderer.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { TextRenderer } from "../../webgl/text/TextRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";

const LETTER_COUNT = 5;
const NAME_SIZE = 0.1;
const NAME_COLOR = CWColor.GREY_BLACK;

export class PlayerRenderer implements UiComponentRenderer {
    private readonly webglPlayerRenderer: WebglPlayerRenderer;
    private readonly textRenderer: TextRenderer;
    private readonly screen: CWScreen;

    constructor(webglPlayerRenderer: WebglPlayerRenderer, textRenderer: TextRenderer, screen: CWScreen) {
        this.webglPlayerRenderer = webglPlayerRenderer;
        this.textRenderer = textRenderer;
        this.screen = screen;
    }

    render(state: ChesswarState) {
        state.getSelfPlayer().ifPresent(selfPlayer => {
            const players = state.getAllPlayers();
            
            // Draw the circles
            this.webglPlayerRenderer.render(selfPlayer.position.center, players);

            // Draw the name
            const cameraOffset = selfPlayer.position.center;
            const screenOffset = this.screen.get().center;
            const centeredOffset = new Point(this.textRenderer.getGlyphBoundingBox().width*LETTER_COUNT*NAME_SIZE/2, 0)
            const textList = players.map(player => new CWText(
                player.id.substring(0, LETTER_COUNT),
                player.position.center
                    .subtract(cameraOffset)
                    .add(screenOffset)
                    .subtract(centeredOffset)
                    .add(new Point(0, player.position.radius+5)),
                NAME_SIZE,
                NAME_COLOR));
            this.textRenderer.render(textList);

            // Draw the death counter
        });
    }
}
