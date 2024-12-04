import { listenKey } from "./core/inputs.ts";
import { socketListen } from "./core/socket.ts";
import { handleKey } from "./game-logic/keys.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { isSafeState, SafeState, state } from "./game-logic/state.ts";
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

function gameLoopUnsafe(): void {
	requestAnimationFrame(gameLoopUnsafe);

	if (isSafeState(state)) {
		gameLoopSafe(state);
	}
}

function gameLoopSafe(state: SafeState): void {
	// Set camera everywhere
	mapRenderer.setCamera(state.selfPlayer.position.center);
	playerRenderer.setCamera(state.selfPlayer.position.center);

	// Set state data
	playerRenderer.setPlayers(state.players);
	uiRenderer.setState(state.selfPlayer.team, state.selfPlayer.role);

	// Render
	mapRenderer.render();
	playerRenderer.render();
	uiRenderer.render();
}
