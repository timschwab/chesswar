import { CWDom } from "../core/CWDom.ts";
import { CWScreen } from "../core/CWScreen.ts";
import { ChesswarState } from "../game-logic/ChesswarState.ts";
import { GameStats } from "../game-logic/GameStats.ts";
import { ChessPieceRenderer } from "../webgl/chessPiece/ChessPieceRenderer.ts";
import { WebglMapRenderer } from "../webgl/map/WebglMapRenderer.ts";
import { WebglPlayerRenderer } from "../webgl/player/WebglPlayerRenderer.ts";
import { RectangleRenderer } from "../webgl/rectangle/RectangleRenderer.ts";
import { TextRenderer } from "../webgl/text/TextRenderer.ts";
import { WebglInterface } from "../webgl/WebglInterface.ts";
import { MapRenderer } from "./component-renderers/MapRenderer.ts";
import { PlayerRenderer } from "./component-renderers/PlayerRenderer.ts";
import { UiComponentRenderer } from "./UiComponentRenderer.ts";
import { ActionOptionRenderer } from "./component-renderers/ActionOptionRenderer.ts";
import { CarryingChessboardRenderer } from "./component-renderers/CarryingChessboardRenderer.ts";
import { HudChessboardRenderer } from "./component-renderers/HudChessboardRenderer.ts";
import { StatsRenderer } from "./component-renderers/StatsRenderer.ts";
import { TeamRoleRenderer } from "./component-renderers/TeamRoleRenderer.ts";
import { GeneralWindowRenderer } from "./component-renderers/GeneralWindowRenderer.ts";
import { VictoryRenderer } from "./component-renderers/VictoryRenderer.ts";
import { TriangleRenderer } from "../webgl/triangle/TriangleRenderer.ts";

export class ChesswarRenderer {
	private readonly state: ChesswarState;
	private previousRenderStart = performance.now();
	private readonly statsManager: GameStats;
	private readonly componentRenderers: UiComponentRenderer[];

	constructor(state: ChesswarState, dom: CWDom, screen: CWScreen, statsManager: GameStats) {
		this.state = state;
		this.statsManager = statsManager;

		// Construct the single canvas to be used for drawing everything
		const canvas = dom.getAttachedCanvas();
		screen.bindCanvas(canvas);
		const webgl = new WebglInterface(canvas, screen);
		webgl.enableAlphaBlend();

		// Create the webgl renderers
		const webglMapRenderer = new WebglMapRenderer(webgl, screen);
		const webglPlayerRenderer = new WebglPlayerRenderer(webgl, screen);
		const rectangleRenderer = new RectangleRenderer(webgl, screen);
		const triangleRenderer = new TriangleRenderer(webgl, screen);
		const textRenderer = new TextRenderer(webgl, dom, screen);
		const chessPieceRenderer = new ChessPieceRenderer(webgl, screen);

		// Create the component renderers from back to front
		this.componentRenderers = [
			new MapRenderer(webglMapRenderer),
			new PlayerRenderer(webglPlayerRenderer, textRenderer, screen),
			new TeamRoleRenderer(rectangleRenderer, textRenderer),
			new ActionOptionRenderer(rectangleRenderer, textRenderer),
			new StatsRenderer(textRenderer, screen, statsManager),
			new HudChessboardRenderer(rectangleRenderer, chessPieceRenderer, triangleRenderer),
			new CarryingChessboardRenderer(rectangleRenderer, chessPieceRenderer, triangleRenderer),
			new VictoryRenderer(textRenderer, screen),
			new GeneralWindowRenderer(rectangleRenderer, chessPieceRenderer, triangleRenderer, screen)
		];
	}

	render() {
		// Detect and record frame rate
		const currentRenderStart = performance.now();
		const timeBetweenAnimationFrames = currentRenderStart - this.previousRenderStart;
		this.previousRenderStart = currentRenderStart;
		this.statsManager.recordTimeBetweenAnimations(timeBetweenAnimationFrames);

		// Record the time spent in JS
		const jsRenderStart = performance.now();
		this.renderComponents();
		const jsRenderFinish = performance.now();
		this.statsManager.recordJsRenderTime(jsRenderFinish - jsRenderStart);
	}

	private renderComponents() {
		// Render from back to front
		this.componentRenderers.forEach(renderer => {
			renderer.render(this.state);
		});
	}
}
