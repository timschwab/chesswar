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
import { GameStats } from "./GameStats.ts";
import { CWAnimationLoop } from "../core/CWAnimationLoop.ts";
import { ChesswarState } from "./ChesswarState.ts";
import { ClickEventHandler } from "./ClickEventHandler.ts";

export class ClientGame {
	private readonly state: ChesswarState;

	private readonly env: CWEnvironment;
	private readonly dom: CWDom;
	private readonly screen: CWScreen;
	private readonly input: CWInput;
	private readonly socket: CWClientSocket;
	private readonly animationLoop: CWAnimationLoop;
	private readonly audioPlayer: ChesswarAudioPlayer;

	private readonly statsManager: GameStats;
	private readonly keyHandler: KeyEventHandler;
	private readonly clickHandler: ClickEventHandler;
	private readonly messageHandler: MessageHandler;
	private readonly pingManager: PingManager;

	private readonly chesswarRenderer: ChesswarRenderer;

	constructor() {
		this.env = new CWEnvironment();
		this.dom = new CWDom();
		this.screen = new CWScreen();
		this.input = new CWInput();
		this.socket = new CWClientSocket(this.env);
		this.animationLoop = new CWAnimationLoop();
		this.audioPlayer = new ChesswarAudioPlayer();

		this.state = new ChesswarState();
		this.statsManager = new GameStats();
		this.keyHandler = new KeyEventHandler(this.state, this.input, this.socket);
		this.clickHandler = new ClickEventHandler(this.state, this.input, this.screen, this.socket);
		this.pingManager = new PingManager(this.socket, this.statsManager);
		this.messageHandler = new MessageHandler(this.state, this.audioPlayer, this.statsManager, this.pingManager);

		this.chesswarRenderer = new ChesswarRenderer(this.state, this.dom, this.screen, this.statsManager);
	}

	start() {
		// Watch the screen resizing
		this.screen.start();

		// Listen for inputs
		this.keyHandler.start();
		this.clickHandler.start();
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
