import { SocketManager } from "./SocketManager.ts";


export class EventHandler {
	private readonly socketManager: SocketManager;

	constructor(socketManager: SocketManager) {
			this.socketManager = socketManager;
		}
}
