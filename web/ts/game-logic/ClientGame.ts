import { socketListen } from "../core/socket.ts";
import { handleKey } from "./keys.ts";
import { receiveMessage } from "./messages.ts";
import { isSafeState, SafeState, state } from "./state.ts";
import { ChesswarRenderer } from "../render/ChesswarRenderer.ts";
import { CWDom } from "../core/CWDom.ts";
import { CWInput } from "../core/CWInput.ts";
import { CWScreen } from "../core/CWScreen.ts";

export class ClientGame {
	private readonly dom: CWDom;
	private readonly screen: CWScreen;
	private readonly input: CWInput;
	private readonly chesswarRenderer: ChesswarRenderer;

	constructor() {
		this.dom = new CWDom();
		this.screen = new CWScreen();
		this.input = new CWInput();

		this.chesswarRenderer = new ChesswarRenderer(this.dom, this.screen);
	}

	start() {
		// Watch the screen resizing
		this.screen.start();

		// Connect to the server
		socketListen(receiveMessage);

		// Get ready for inputs
		this.input.listenKey(handleKey);

		// Start recieving inputs
		this.input.start();

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
