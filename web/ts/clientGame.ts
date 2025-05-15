import { listenKey } from "./core/inputs.ts";
import { socketListen } from "./core/socket.ts";
import { handleKey } from "./game-logic/keys.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { isSafeState, SafeState, state } from "./game-logic/state.ts";
import { recordJsRenderTime, recordRenderTime, recordTimeBetweenAnimations } from "./game-logic/statsManager.ts";
import { MapRenderer } from "./render/MapRenderer.ts";
import { UserInterfaceRenderer } from "./render/UserInterfaceRenderer.ts";
import { PlayerRenderer } from "./webgl/player/PlayerRenderer.ts";

// Create the renderers from back to front
const mapRenderer = new MapRenderer();
const playerRenderer = new PlayerRenderer();
const uiRenderer = new UserInterfaceRenderer();

initGame();

function initGame() {
	// Receive server messages
	socketListen(receiveMessage);

	// Send client messages
	listenKey(handleKey);

	// Start rendering
	requestAnimationFrame(gameLoopUnsafe);
}

let previousRenderStart = performance.now();
async function gameLoopUnsafe() {
	const currentRenderStart = performance.now();
	const timeBetweenAnimationFrames = currentRenderStart - previousRenderStart;
	previousRenderStart = currentRenderStart;

	recordTimeBetweenAnimations(timeBetweenAnimationFrames);

	if (isSafeState(state)) {
		await gameLoopSafe(state);
	}

	requestAnimationFrame(gameLoopUnsafe);
}

async function gameLoopSafe(state: SafeState) {
	const jsRenderStart = performance.now();
	await render(state);
	const jsRenderFinish = performance.now();

	recordJsRenderTime(jsRenderFinish - jsRenderStart);
}

async function render(state: SafeState) {
	// Set camera
	mapRenderer.setCamera(state.selfPlayer.position.center);

	// Set state data
	//await uiRenderer.setState(state);

	// Render
	mapRenderer.render();
	playerRenderer.render(state.selfPlayer.position.center, state.players);
	//uiRenderer.render();
}
