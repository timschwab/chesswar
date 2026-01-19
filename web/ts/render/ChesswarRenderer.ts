import { CWDom } from "../core/CWDom.ts";
import { CWScreen } from "../core/CWScreen.ts";
import { ChesswarState } from "../game-logic/ChesswarState.ts";
import { GameStats } from "../game-logic/GameStats.ts";
import { ChessPieceRenderer } from "../webgl/chessPiece/ChessPieceRenderer.ts";
import { MapRenderer } from "../webgl/map/MapRenderer.ts";
import { PlayerRenderer } from "../webgl/player/PlayerRenderer.ts";
import { RectangleRenderer } from "../webgl/rectangle/RectangleRenderer.ts";
import { TextRenderer } from "../webgl/text/TextRenderer.ts";
import { WebglInterface } from "../webgl/WebglInterface.ts";
import { ActionOptionRenderer } from "./UserInterface/ActionOptionRenderer.ts";
import { CarryingChessboardRenderer } from "./UserInterface/CarryingChessboardRenderer.ts";
import { HudChessboardRenderer } from "./UserInterface/HudChessboardRenderer.ts";
import { StatsRenderer } from "./UserInterface/StatsRenderer.ts";
import { TeamRoleRenderer } from "./UserInterface/TeamRoleRenderer.ts";

export class ChesswarRenderer {
	private readonly state: ChesswarState;

	private previousRenderStart = performance.now();
	private readonly statsManager: GameStats;
	
	private readonly mapRenderer: MapRenderer;
	private readonly playerRenderer: PlayerRenderer;
	
	private readonly teamRoleRenderer: TeamRoleRenderer;
	private readonly actionOptionRenderer: ActionOptionRenderer;
	private readonly statsRenderer: StatsRenderer;
	private readonly hudChessboardRenderer: HudChessboardRenderer;
	private readonly carryingChessBoardRenderer: CarryingChessboardRenderer;

	constructor(state: ChesswarState, dom: CWDom, screen: CWScreen, statsManager: GameStats) {
		this.state = state;
		this.statsManager = statsManager;

		// Construct the canvas to be used for drawing everything
		const canvas = dom.getAttachedCanvas();
		screen.bindCanvas(canvas);
		const webgl = new WebglInterface(canvas, screen);
		webgl.enableAlphaBlend();

		// Create the renderers
		this.mapRenderer = new MapRenderer(webgl, screen);
		this.playerRenderer = new PlayerRenderer(webgl, screen);

		const rectangleRenderer = new RectangleRenderer(webgl, screen);
		const textRenderer = new TextRenderer(webgl, dom, screen);
		const chessPieceRenderer = new ChessPieceRenderer(webgl, screen);

		this.teamRoleRenderer = new TeamRoleRenderer(rectangleRenderer, textRenderer);
		this.actionOptionRenderer = new ActionOptionRenderer(rectangleRenderer, textRenderer);
		this.statsRenderer = new StatsRenderer(textRenderer, screen);
		this.hudChessboardRenderer = new HudChessboardRenderer(rectangleRenderer, chessPieceRenderer);
		this.carryingChessBoardRenderer = new CarryingChessboardRenderer(rectangleRenderer, chessPieceRenderer);
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
		this.state.getSelfPlayer().ifPresent(selfPlayer => {
			this.mapRenderer.render(selfPlayer.position.center);
			this.playerRenderer.render(selfPlayer.position.center, this.state.getAllPlayers());
			
			this.teamRoleRenderer.render(selfPlayer.team, selfPlayer.role);
			this.actionOptionRenderer.render(selfPlayer.actionOption);
		});

		this.state.getTeamInfo().ifPresent(info => {
			this.hudChessboardRenderer.render(info.board);
			this.carryingChessBoardRenderer.render(info.board, this.state.getCarrying());
		});

		if (this.state.getStatsShowing()) {
			this.statsRenderer.render(this.statsManager);
		}
	}
}
