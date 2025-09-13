import { receiveMessage } from "./messages.ts";
import { isSafeState, SafeState, state } from "./state.ts";
import { ChesswarRenderer } from "../render/ChesswarRenderer.ts";
import { CWDom } from "../core/CWDom.ts";
import { CWInput } from "../core/CWInput.ts";
import { CWScreen } from "../core/CWScreen.ts";
import { CWEnvironment } from "../core/CWEnvironment.ts";
import { CWClientSocket } from "../core/CWClientSocket.ts";
import { KeyEventHandler } from "./KeyEventHandler.ts";

export class ClientGame {
	private readonly env: CWEnvironment;
	private readonly dom: CWDom;
	private readonly screen: CWScreen;
	private readonly input: CWInput;
	private readonly socket: CWClientSocket;

	private readonly keyHandler: KeyEventHandler;

	private readonly chesswarRenderer: ChesswarRenderer;

	constructor() {
		this.env = new CWEnvironment();
		this.dom = new CWDom();
		this.screen = new CWScreen();
		this.input = new CWInput();
		this.socket = new CWClientSocket(this.env);

		this.keyHandler = new KeyEventHandler(this.input, this.socket);

		this.chesswarRenderer = new ChesswarRenderer(this.dom, this.screen);
	}

	start() {
		// Watch the screen resizing
		this.screen.start();

		// Listen for inputs
		this.keyHandler.start();
		this.input.start();

		// Start the game loop
		requestAnimationFrame(this.gameLoopUnsafe.bind(this));

		// Connect to the server
		this.socket.start();
		this.socket.listen(receiveMessage);
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
