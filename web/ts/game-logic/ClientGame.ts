import { listenKey } from "../core/inputs.ts";
import { socketListen } from "../core/socket.ts";
import { handleKey } from "./keys.ts";
import { receiveMessage } from "./messages.ts";
import { isSafeState, SafeState, state } from "./state.ts";
import { ChesswarRenderer } from "../render/ChesswarRenderer.ts";

export class ClientGame {
	private readonly chesswarRenderer: ChesswarRenderer;

	constructor() {
		this.chesswarRenderer = new ChesswarRenderer();
	}

	start() {
		// Receive server messages
		socketListen(receiveMessage);

		// Send client messages
		listenKey(handleKey);

		// Start the game loop
		requestAnimationFrame(this.gameLoopUnsafe.bind(this));
	}

	private async gameLoopUnsafe() {
		// Run the game loop when we have all the info needed
		if (isSafeState(state)) {
			await this.gameLoopSafe(state);
		}
	
		// Get the next animation frame
		requestAnimationFrame(this.gameLoopUnsafe.bind(this));
	}

	private async gameLoopSafe(state: SafeState) {
		// So far the game loop just renders the UI
		await this.chesswarRenderer.render(state);
	}
}
