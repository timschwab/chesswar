import { ClientMessageWithId } from "../common/message-types/client.ts";
import { addPlayer, receiveMessage, removePlayer } from "./events.ts";
import { SocketManager } from "./SocketManager.ts";


export class EventHandler {
	private readonly socketManager: SocketManager;

	constructor(socketManager: SocketManager) {
		this.socketManager = socketManager;
	}

	addPlayer(id: string): void {
		addPlayer(this.socketManager, id);
	}

	removePlayer(id: string): void {
		removePlayer(id);
	}

	receiveMessage(message: ClientMessageWithId): void {
		receiveMessage(this.socketManager, message)
	}
}
