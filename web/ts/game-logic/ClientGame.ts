import { listenKey } from "../core/inputs.ts";
import { socketListen } from "../core/socket.ts";
import { handleKey } from "./keys.ts";
import { receiveMessage } from "./messages.ts";
import { isSafeState, SafeState, state } from "./state.ts";
import { recordJsRenderTime, recordTimeBetweenAnimations } from "./statsManager.ts";
//import { UserInterfaceRenderer } from "../render/UserInterfaceRenderer.ts";
import { MapRenderer } from "../webgl/map/MapRenderer.ts";
import { PlayerRenderer } from "../webgl/player/PlayerRenderer.ts";

export class ClientGame {
	private readonly mapRenderer: MapRenderer;
	private readonly playerRenderer: PlayerRenderer;
//	private readonly uiRenderer: UserInterfaceRenderer;
	private previousRenderStart = performance.now();

	constructor() {
		// Create the renderers from back to front
		this.mapRenderer = new MapRenderer();
		this.playerRenderer = new PlayerRenderer();
//		this.uiRenderer = new UserInterfaceRenderer();
	}

	start() {
		// Receive server messages
		socketListen(receiveMessage);

		// Send client messages
		listenKey(handleKey);

		// Start rendering
		requestAnimationFrame(this.gameLoopUnsafe);
	}

	async gameLoopUnsafe() {
		// Detect frame rate
		const currentRenderStart = performance.now();
		const timeBetweenAnimationFrames = currentRenderStart - this.previousRenderStart;
		this.previousRenderStart = currentRenderStart;
		recordTimeBetweenAnimations(timeBetweenAnimationFrames);
	
		// Actually run the gameloop (pretty much just rendering)
		if (isSafeState(state)) {
			await this.gameLoopSafe(state);
		}
	
		// Get the next animation frame
		requestAnimationFrame(this.gameLoopUnsafe);
	}

	async gameLoopSafe(state: SafeState) {
		// Wrap the rendering in a time calculation
		const jsRenderStart = performance.now();
		await this.render(state);
		const jsRenderFinish = performance.now();
		recordJsRenderTime(jsRenderFinish - jsRenderStart);
	}

	async render(state: SafeState) {
		// Set state data
//		await uiRenderer.setState(state);
	
		// Render
		this.mapRenderer.render(state.selfPlayer.position.center);
		this.playerRenderer.render(state.selfPlayer.position.center, state.players);
//		uiRenderer.render();
	}
}
