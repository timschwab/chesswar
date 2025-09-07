import { listenKey } from "../core/inputs.ts";
import { socketListen } from "../core/socket.ts";
import { handleKey } from "./keys.ts";
import { receiveMessage } from "./messages.ts";
import { isSafeState, SafeState, state } from "./state.ts";
import { ChesswarRenderer } from "../render/ChesswarRenderer.ts";
import { Dom } from "../core/Dom.ts";

export class ClientGame {
	private readonly chesswarRenderer: ChesswarRenderer;

	constructor() {
		const dom = new Dom();
		this.chesswarRenderer = new ChesswarRenderer(dom);
	}

	start() {
		// Receive server messages
		socketListen(receiveMessage);

		// Send client messages
		listenKey(handleKey);

		// Start the game loop
		requestAnimationFrame(this.gameLoopUnsafe.bind(this));
	}

	private gameLoopUnsafe() {
		// Run the game loop when we have all the info needed
		if (isSafeState(state)) {
			this.gameLoopSafe(state);
		}
	
		// Get the next animation frame
		requestAnimationFrame(this.gameLoopUnsafe.bind(this));
	}

	private gameLoopSafe(state: SafeState) {
		// So far the game loop just renders the UI
		this.chesswarRenderer.render(state);
	}
}
