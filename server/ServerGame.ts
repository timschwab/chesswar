import { gameEngine } from "../common/settings.ts";
import { addPlayer, receiveMessage, removePlayer } from "./events.ts";
import { SocketManager } from "./SocketManager.ts";
import { TickHandler } from "./TickHandler.ts";

export class ServerGame {
    private readonly socketManager: SocketManager;
    private readonly tickHandler: TickHandler;

    constructor() {
        this.socketManager = new SocketManager();
        this.tickHandler = new TickHandler(this.socketManager);
    }

    start() {
        this.socketManager.listenAdd(id => addPlayer(this.socketManager, id));
        this.socketManager.listenRemove(removePlayer);
        this.socketManager.listenMessage(message => receiveMessage(this.socketManager, message));
    
        // Set up ticking
        setInterval(this.tickHandler.tick.bind(this.tickHandler), gameEngine.mspt);
    }

    newConnection(socket: WebSocket) {
        this.socketManager.newConnection(socket);
    }
}
