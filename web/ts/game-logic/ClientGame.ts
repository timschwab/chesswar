import { socketListen } from "../core/socket.ts";
import { handleKey } from "./keys.ts";
import { receiveMessage } from "./messages.ts";
import { isSafeState, SafeState, state } from "./state.ts";
import { ChesswarRenderer } from "../render/ChesswarRenderer.ts";
import { CWDom } from "../core/CWDom.ts";
import { CWInput } from "../core/CWInput.ts";

export class ClientGame {
	private readonly cwInput = new CWInput();
	private readonly chesswarRenderer: ChesswarRenderer;

	constructor() {
		const dom = new CWDom();
		this.chesswarRenderer = new ChesswarRenderer(dom);
	}

	start() {
		// Receive server messages
		socketListen(receiveMessage);

		// Get ready for inputs
		this.cwInput.listenKey(handleKey);

		// Start recieving inputs
		this.cwInput.start();

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
