import { CWColor } from "../../../common/Color.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { SafeState } from "../game-logic/state.ts";
import { recordJsRenderTime, recordTimeBetweenAnimations } from "../game-logic/statsManager.ts";
//import { ChessboardRenderer } from "../webgl/chessboard/ChessboardRenderer.ts";
import { MapRenderer } from "../webgl/map/MapRenderer.ts";
import { PlayerRenderer } from "../webgl/player/PlayerRenderer.ts";
import { RectangleRenderer } from "../webgl/rectangle/RectangleRenderer.ts";
import { CWText } from "../webgl/text/CWText.ts";
import { TextRenderer } from "../webgl/text/TextRenderer.ts";
import { TeamRoleRenderer } from "./UserInterface/TeamRoleRenderer.ts";

export class ChesswarRenderer {
	private previousRenderStart = performance.now();

	private readonly mapRenderer: MapRenderer;
	private readonly playerRenderer: PlayerRenderer;
	private readonly textRenderer: TextRenderer;
	private readonly teamRoleRenderer: TeamRoleRenderer;
	//private readonly chessboardRenderer: ChessboardRenderer;

	constructor() {
		// Create the renderers from back to front
		this.mapRenderer = new MapRenderer();
		this.playerRenderer = new PlayerRenderer();

		const rectangleRenderer = new RectangleRenderer();
		this.textRenderer = new TextRenderer();

		this.teamRoleRenderer = new TeamRoleRenderer(rectangleRenderer);
		//this.chessboardRenderer = new ChessboardRenderer();
	}

	async render(state: SafeState) {
		// Detect and record frame rate
		const currentRenderStart = performance.now();
		const timeBetweenAnimationFrames = currentRenderStart - this.previousRenderStart;
		this.previousRenderStart = currentRenderStart;
		recordTimeBetweenAnimations(timeBetweenAnimationFrames);

		// Record the time spent in JS
		const jsRenderStart = performance.now();
		await this.internalRender(state);
		const jsRenderFinish = performance.now();
		recordJsRenderTime(jsRenderFinish - jsRenderStart);
	}

	private async internalRender(state: SafeState) {
		//this.mapRenderer.render(state.selfPlayer.position.center);
		//this.playerRenderer.render(state.selfPlayer.position.center, state.players);
		//this.teamRoleRenderer.render(state);

		const text = new CWText("1a2a3a4", new Point(0, 300), 1, CWColor.GREY_WHITE);
		await this.textRenderer.render([text]);

		// Start reworking text renderer
	}
}
