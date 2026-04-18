import slim from "../common/slim-id.ts";
import { Hook, HookFunc } from "../common/data-structures/Hook.ts";
import { ChesswarId } from "../common/data-types/base.ts";
import { ClientMessage, ClientMessageWithId } from "../common/message-types/client.ts";
import { ServerMessage } from "../common/message-types/server.ts";

enum SocketEvent {
	OPEN = "open",
	MESSAGE = "message",
	ERROR = "error",
	CLOSE = "close"
}

export class SocketManager {
	private readonly sockets = new Map<ChesswarId, WebSocket>();
	private readonly addHook = new Hook<ChesswarId>();
	private readonly removeHook = new Hook<ChesswarId>();
	private readonly messageHook = new Hook<ClientMessageWithId>();

	newConnection(socket: WebSocket) {
		const id: ChesswarId = slim.make();
		socket.addEventListener(SocketEvent.OPEN, () => this.handleSocketOpen(id, socket));
		socket.addEventListener(SocketEvent.MESSAGE, event => this.handleSocketMessage(id, event));
		socket.addEventListener(SocketEvent.ERROR, event => this.handleSocketError(id, event));
		socket.addEventListener(SocketEvent.CLOSE, event => this.handleSocketClose(id, event));
	}

	private handleSocketOpen(id: ChesswarId, socket: WebSocket) {
		console.log(`--- ${id}: ${SocketEvent.OPEN} ---`);
		this.sockets.set(id, socket);
		this.addHook.run(id);
	}

	private handleSocketMessage(id: ChesswarId, messageEvent: MessageEvent) {
		const str = messageEvent.data;

		console.log(`--- ${id}: ${SocketEvent.MESSAGE} ---`);
		console.log(str);

		const message = JSON.parse(str) as ClientMessage;
		const messageWithId = {...message, id};
		this.messageHook.run(messageWithId);
	}

	private handleSocketError(id: ChesswarId, errorEvent: Event) {
		console.log(`--- ${id}: ${SocketEvent.ERROR} ---`);
		console.log(errorEvent);

		// All errors will result in a close, so don't clean up the connection here
	}

	private handleSocketClose(id: ChesswarId, closeEvent: CloseEvent) {
		console.log(`--- ${id}: ${SocketEvent.CLOSE} ---`);
		if (!closeEvent.wasClean) {
			console.log(closeEvent);
		}

		this.sockets.delete(id);
		this.removeHook.run(id);
	}

	sendAll(message: ServerMessage) {
		const str = JSON.stringify(message);
		for (const socket of this.sockets.values()) {
			this.safeSend(socket, str);
		}
	}

	sendBulk(ids: ChesswarId[], message: ServerMessage) {
		const str = JSON.stringify(message);
		ids.map(id => this.getSocket(id)).forEach(socket => this.safeSend(socket, str));
	}

	sendOne(id: ChesswarId, message: ServerMessage) {
		const str = JSON.stringify(message);
		const socket = this.getSocket(id);
		this.safeSend(socket, str);
	}

	private getSocket(id: ChesswarId): WebSocket {
		const socket = this.sockets.get(id);
		if (socket === undefined) {
			throw "Could not find connection with id " + id;
		} else {
			return socket;
		}
	}

	private safeSend(socket: WebSocket, message: string): void {
		try {
			socket.send(message);
		} catch (err) {
			console.error({message, err});
		}
	}

	listenAdd(callback: HookFunc<ChesswarId>) {
		this.addHook.register(callback);
	}

	listenRemove(callback: HookFunc<ChesswarId>) {
		this.removeHook.register(callback);
	}

	listenMessage(callback: HookFunc<ClientMessageWithId>) {
		this.messageHook.register(callback);
	}
}
