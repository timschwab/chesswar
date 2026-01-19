import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { WebglMapRenderer } from "../../webgl/map/WebglMapRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";

export class MapRenderer implements UiComponentRenderer {
	private readonly webglMapRenderer: WebglMapRenderer;

	constructor(webglMapRenderer: WebglMapRenderer) {
		this.webglMapRenderer = webglMapRenderer;
	}

	render(state: ChesswarState) {
		state.getSelfPlayer().ifPresent(selfPlayer => {
			this.webglMapRenderer.render(selfPlayer.position.center);
		});
	}
}
