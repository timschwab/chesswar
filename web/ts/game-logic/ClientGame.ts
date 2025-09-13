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
import { ChesswarStats } from "./ChesswarStats.ts";
import { CWWAnimationLoop } from "../core/CWAnimationLoop.ts";
import { ChesswarState } from "./ChesswarState.ts";

export class ClientGame {
	private readonly state: ChesswarState;

	private readonly env: CWEnvironment;
	private readonly dom: CWDom;
	private readonly screen: CWScreen;
	private readonly input: CWInput;
	private readonly socket: CWClientSocket;
	private readonly animationLoop: CWWAnimationLoop;
	private readonly audioPlayer: ChesswarAudioPlayer;

	private readonly statsManager: ChesswarStats;
	private readonly keyHandler: KeyEventHandler;
	private readonly messageHandler: MessageHandler;
	private readonly pingManager: PingManager;

	private readonly chesswarRenderer: ChesswarRenderer;

	constructor() {
		this.state = new ChesswarState();

		this.env = new CWEnvironment();
		this.dom = new CWDom();
		this.screen = new CWScreen();
		this.input = new CWInput();
		this.socket = new CWClientSocket(this.env);
		this.animationLoop = new CWWAnimationLoop();
		this.audioPlayer = new ChesswarAudioPlayer();

		this.statsManager = new ChesswarStats();
		this.keyHandler = new KeyEventHandler(this.state, this.input, this.socket);
		this.pingManager = new PingManager(this.socket, this.statsManager);
		this.messageHandler = new MessageHandler(this.state, this.audioPlayer, this.statsManager, this.pingManager);

		this.chesswarRenderer = new ChesswarRenderer(this.state, this.dom, this.screen, this.statsManager);
	}

	start() {
		// Watch the screen resizing
		this.screen.start();

		// Listen for inputs
		this.keyHandler.start();
		this.input.start();

		// Connect to the server
		this.socket.listen(this.messageHandler.receiveMessage.bind(this.messageHandler));
		this.socket.start();
		this.pingManager.start();

		// Start the animation loop
		this.animationLoop.register(this.chesswarRenderer.render.bind(this.chesswarRenderer));
		this.animationLoop.start();
	}
}
