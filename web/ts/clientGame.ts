import { listenKey } from "./core/inputs.ts";
import { socketListen } from "./core/socket.ts";
import { handleKey } from "./game-logic/keys.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { isSafeState, SafeState, state } from "./game-logic/state.ts";
import { recordAnimationTime, recordJsRenderTime } from "./game-logic/statsManager.ts";
import { MapRenderer } from "./render/MapRenderer.ts";
import { PlayerRenderer } from "./render/PlayerRenderer.ts";
import { UserInterfaceRenderer } from "./render/UserInterfaceRenderer.ts";

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

let previousAnimationStart = performance.now();
async function gameLoopUnsafe() {
	const currentAnimationStart = performance.now();
	const animationStartDiff = currentAnimationStart - previousAnimationStart;
	previousAnimationStart = currentAnimationStart;
	recordAnimationTime(animationStartDiff);

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
	playerRenderer.setCamera(state.selfPlayer.position.center);

	// Set state data
	await playerRenderer.setPlayers(state.players);
	await uiRenderer.setState(state);

	// Render
	mapRenderer.render();
	//playerRenderer.render();
	uiRenderer.render();
}
