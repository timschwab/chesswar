import { Dom } from "../core/Dom.ts";
import { SafeState } from "../game-logic/state.ts";
import { recordJsRenderTime, recordTimeBetweenAnimations } from "../game-logic/statsManager.ts";
//import { ChessboardRenderer } from "../webgl/chessboard/ChessboardRenderer.ts";
import { MapRenderer } from "../webgl/map/MapRenderer.ts";
import { PlayerRenderer } from "../webgl/player/PlayerRenderer.ts";
import { RectangleRenderer } from "../webgl/rectangle/RectangleRenderer.ts";
import { TextRenderer } from "../webgl/text/TextRenderer.ts";
import { ActionOptionRenderer } from "./UserInterface/ActionOptionRenderer.ts";
import { StatsRenderer } from "./UserInterface/StatsRenderer.ts";
import { TeamRoleRenderer } from "./UserInterface/TeamRoleRenderer.ts";

export class ChesswarRenderer {
	private previousRenderStart = performance.now();

	private readonly mapRenderer: MapRenderer;
	private readonly playerRenderer: PlayerRenderer;

	private readonly teamRoleRenderer: TeamRoleRenderer;
	private readonly actionOptionRenderer: ActionOptionRenderer;
	private readonly statsRenderer: StatsRenderer;

	//private readonly chessboardRenderer: ChessboardRenderer;

	constructor(dom: Dom) {
		// Create the renderers from back to front
		this.mapRenderer = new MapRenderer(dom);
		this.playerRenderer = new PlayerRenderer(dom);

		const rectangleRenderer = new RectangleRenderer(dom);
		const textRenderer = new TextRenderer(dom);

		this.teamRoleRenderer = new TeamRoleRenderer(rectangleRenderer, textRenderer);
		this.actionOptionRenderer = new ActionOptionRenderer(rectangleRenderer, textRenderer);
		this.statsRenderer = new StatsRenderer(rectangleRenderer, textRenderer);

		//this.chessboardRenderer = new ChessboardRenderer();
	}

	render(state: SafeState) {
		// Detect and record frame rate
		const currentRenderStart = performance.now();
		const timeBetweenAnimationFrames = currentRenderStart - this.previousRenderStart;
		this.previousRenderStart = currentRenderStart;
		recordTimeBetweenAnimations(timeBetweenAnimationFrames);

		// Record the time spent in JS
		const jsRenderStart = performance.now();
		this.internalRender(state);
		const jsRenderFinish = performance.now();
		recordJsRenderTime(jsRenderFinish - jsRenderStart);
	}

	private internalRender(state: SafeState) {
		this.mapRenderer.render(state.selfPlayer.position.center);
		this.playerRenderer.render(state.selfPlayer.position.center, state.players);

		this.teamRoleRenderer.render(state);
		this.actionOptionRenderer.render(state);
		this.statsRenderer.render(state);
	}
}
