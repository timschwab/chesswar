import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { WebglPlayerRenderer } from "../../webgl/player/WebglPlayerRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";

export class PlayerRenderer implements UiComponentRenderer {
    private readonly webglPlayerRenderer: WebglPlayerRenderer;

    constructor(webglPlayerRenderer: WebglPlayerRenderer) {
        this.webglPlayerRenderer = webglPlayerRenderer;
    }

    render(state: ChesswarState) {
        state.getSelfPlayer().ifPresent(selfPlayer => {
            this.webglPlayerRenderer.render(selfPlayer.position.center, state.getAllPlayers());
        });
    }
}
