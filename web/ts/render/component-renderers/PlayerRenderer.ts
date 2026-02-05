import { CWColor } from "../../../../common/Color.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { ZeroPoint } from "../../../../common/shapes/Zero.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { WebglPlayerRenderer } from "../../webgl/player/WebglPlayerRenderer.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { TextRenderer } from "../../webgl/text/TextRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";

const TEXT_SIZE = 0.1;
const NAME_LETTERS = 5;
const NAME_COLOR = CWColor.GREY_BLACK;
const DEATH_COUNTER_LETTERS = 3;
const DEATH_COUNTER_COLOR = CWColor.GREY_BLACK;

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
            const nameCenteredOffset = this.textBoundingBox(this.textRenderer.getGlyphBoundingBox(), TEXT_SIZE, NAME_LETTERS);
            const nameOffset = ZeroPoint.subtract(cameraOffset).add(screenOffset).subtract(nameCenteredOffset.center);
            const deathCenteredOffset = this.textBoundingBox(this.textRenderer.getGlyphBoundingBox(), TEXT_SIZE, DEATH_COUNTER_LETTERS);
            const deathOffset = ZeroPoint.subtract(cameraOffset).add(screenOffset).subtract(deathCenteredOffset.center);
            
            const nameList = players.map(player => new CWText(
                player.id.substring(0, NAME_LETTERS),
                player.position.center.add(nameOffset).add(new Point(0, player.position.radius+10)),
                TEXT_SIZE,
                NAME_COLOR));
            this.textRenderer.render(nameList);

            // Draw the death counter
            const deathCounterList = players.map(player => new CWText(
                player.deathCounter.toString().padStart(DEATH_COUNTER_LETTERS, "0"),
                player.position.center.add(deathOffset).subtract(new Point(0, player.position.radius+10)),
                TEXT_SIZE,
                DEATH_COUNTER_COLOR));
            this.textRenderer.render(deathCounterList);
        });
    }

    private textBoundingBox(glyphBoundingBox: Rect, size: number, letterCount: number) {
        return new Rect(
            ZeroPoint,
            new Point(
                glyphBoundingBox.width*size*letterCount,
                glyphBoundingBox.height*size
            )
        );
    }
}
