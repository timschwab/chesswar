import { gameEngine } from "../common/settings.ts";
import { EventHandler } from "./EventHandler.ts";
import { SocketManager } from "./SocketManager.ts";
import { TickHandler } from "./TickHandler.ts";

export class ServerGame {
	private readonly socketManager: SocketManager;
	private readonly tickHandler: TickHandler;
	private readonly eventHandler: EventHandler;

	constructor() {
		this.socketManager = new SocketManager();
		this.tickHandler = new TickHandler(this.socketManager);
		this.eventHandler = new EventHandler(this.socketManager);
	}

	start() {
		this.socketManager.listenAdd(id => this.eventHandler.addPlayer(id));
		this.socketManager.listenRemove(id => this.eventHandler.removePlayer(id));
		this.socketManager.listenMessage(message => this.eventHandler.receiveMessage(message));
	
		// Set up ticking
		setInterval(() => this.tickHandler.tick(), gameEngine.mspt);
	}

	newConnection(socket: WebSocket) {
		this.socketManager.newConnection(socket);
	}
}
