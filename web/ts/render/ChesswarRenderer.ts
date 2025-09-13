import { CWDom } from "../core/CWDom.ts";
import { CWScreen } from "../core/CWScreen.ts";
import { SafeState } from "../game-logic/state.ts";
import { ChesswarStats } from "../game-logic/ChesswarStats.ts";
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
	private readonly statsManager: ChesswarStats;
	
	private readonly mapRenderer: MapRenderer;
	private readonly playerRenderer: PlayerRenderer;
	
	private readonly teamRoleRenderer: TeamRoleRenderer;
	private readonly actionOptionRenderer: ActionOptionRenderer;
	private readonly statsRenderer: StatsRenderer;
	
	//private readonly chessboardRenderer: ChessboardRenderer;

	constructor(dom: CWDom, screen: CWScreen, statsManager: ChesswarStats) {
		this.statsManager = statsManager;

		// Create the renderers from back to front
		this.mapRenderer = new MapRenderer(dom, screen);
		this.playerRenderer = new PlayerRenderer(dom, screen);

		const rectangleRenderer = new RectangleRenderer(dom, screen);
		const textRenderer = new TextRenderer(dom, screen);

		this.teamRoleRenderer = new TeamRoleRenderer(rectangleRenderer, textRenderer);
		this.actionOptionRenderer = new ActionOptionRenderer(rectangleRenderer, textRenderer);
		this.statsRenderer = new StatsRenderer(rectangleRenderer, textRenderer, screen, this.statsManager);

		//this.chessboardRenderer = new ChessboardRenderer();
	}

	render(state: SafeState) {
		// Detect and record frame rate
		const currentRenderStart = performance.now();
		const timeBetweenAnimationFrames = currentRenderStart - this.previousRenderStart;
		this.previousRenderStart = currentRenderStart;
		this.statsManager.recordTimeBetweenAnimations(timeBetweenAnimationFrames);

		// Record the time spent in JS
		const jsRenderStart = performance.now();
		this.internalRender(state);
		const jsRenderFinish = performance.now();
		this.statsManager.recordJsRenderTime(jsRenderFinish - jsRenderStart);
	}

	private internalRender(state: SafeState) {
		this.mapRenderer.render(state.selfPlayer.position.center);
		this.playerRenderer.render(state.selfPlayer.position.center, state.players);

		this.teamRoleRenderer.render(state);
		this.actionOptionRenderer.render(state);
		this.statsRenderer.render(state);
	}
}
