import { isSafeState, SafeState, state } from "./state.ts";
import { ChesswarRenderer } from "../render/ChesswarRenderer.ts";
import { CWDom } from "../core/CWDom.ts";
import { CWInput } from "../core/CWInput.ts";
import { CWScreen } from "../core/CWScreen.ts";
import { CWEnvironment } from "../core/CWEnvironment.ts";
import { CWClientSocket } from "../core/CWClientSocket.ts";
import { KeyEventHandler } from "./KeyEventHandler.ts";
import { PingManager } from "./PingManager.ts";
import { MessageHandler } from "./MessageHandler.ts";
import { ChesswarAudioPlayer } from "../audio/ChesswarAudioPlayer.ts";
import { StatsManager } from "./StatsManager.ts";

export class ClientGame {
	private readonly env: CWEnvironment;
	private readonly dom: CWDom;
	private readonly screen: CWScreen;
	private readonly input: CWInput;
	private readonly socket: CWClientSocket;
	private readonly audioPlayer: ChesswarAudioPlayer;

	private readonly statsManager: StatsManager;
	private readonly keyHandler: KeyEventHandler;
	private readonly messageHandler: MessageHandler;
	private readonly pingManager: PingManager;

	private readonly chesswarRenderer: ChesswarRenderer;

	constructor() {
		this.env = new CWEnvironment();
		this.dom = new CWDom();
		this.screen = new CWScreen();
		this.input = new CWInput();
		this.socket = new CWClientSocket(this.env);
		this.audioPlayer = new ChesswarAudioPlayer();

		this.statsManager = new StatsManager();
		this.keyHandler = new KeyEventHandler(this.input, this.socket);
		this.pingManager = new PingManager(this.socket, this.statsManager);
		this.messageHandler = new MessageHandler(this.audioPlayer, this.statsManager, this.pingManager);

		this.chesswarRenderer = new ChesswarRenderer(this.dom, this.screen, this.statsManager);
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
		this.socket.listen(this.messageHandler.receiveMessage.bind(this.messageHandler));
		this.pingManager.start();
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
