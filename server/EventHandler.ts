import { SocketManager } from "./SocketManager";


export class EventHandler {
	private readonly socketManager: SocketManager;

	constructor(socketManager: SocketManager) {
			this.socketManager = socketManager;
		}
}
