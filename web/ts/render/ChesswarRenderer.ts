import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { SafeState } from "../game-logic/state.ts";
import { recordJsRenderTime, recordTimeBetweenAnimations } from "../game-logic/statsManager.ts";
//import { ChessboardRenderer } from "../webgl/chessboard/ChessboardRenderer.ts";
import { MapRenderer } from "../webgl/map/MapRenderer.ts";
import { PlayerRenderer } from "../webgl/player/PlayerRenderer.ts";
import { RectangleRenderer } from "../webgl/rectangle/RectangleRenderer.ts";

export class ChesswarRenderer {
	private previousRenderStart = performance.now();

	private readonly mapRenderer: MapRenderer;
	private readonly playerRenderer: PlayerRenderer;
	private readonly rectangleRenderer: RectangleRenderer;
	//private readonly chessboardRenderer: ChessboardRenderer;

	constructor() {
		// Create the renderers from back to front
		this.mapRenderer = new MapRenderer();
		this.playerRenderer = new PlayerRenderer();
		this.rectangleRenderer = new RectangleRenderer();
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
		this.mapRenderer.render(state.selfPlayer.position.center);
		this.playerRenderer.render(state.selfPlayer.position.center, state.players);

		// Just start figuring out the rectangles here for now

		// Team/role
		const team = state.selfPlayer.team;
		const teamColor = rensets.players.teamColor[team];
		const innerRect = new Rect(new Point(10, 10), new Point(210, 50));
		const outerRect = innerRect.expand(rensets.currentRole.outlineWidth);
		const shapes = [Shape.from(innerRect, teamColor), Shape.from(outerRect, rensets.currentRole.outlineColor)];
		this.rectangleRenderer.render(shapes);
	}
}
