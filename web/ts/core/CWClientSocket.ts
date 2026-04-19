import { Hook, HookFunc } from "../../../common/data-structures/Hook.ts";
import { ClientMessage } from "../../../common/message-types/client.ts";
import { ServerMessage } from "../../../common/message-types/server.ts";
import { CWEnvironment } from "./CWEnvironment.ts";

export class CWClientSocket {
	private readonly env: CWEnvironment;
	private readonly messageHook = new Hook<ServerMessage>();
	private socket: WebSocket | null = null;

	constructor(env: CWEnvironment) {
		this.env = env;
	}

	start() {
		this.socket = new WebSocket(this.env.apiOrigin());

		this.socket.addEventListener("open", this.socketOpen.bind(this));
		this.socket.addEventListener("message", this.socketMessage.bind(this));
		this.socket.addEventListener("error", this.socketError.bind(this));
		this.socket.addEventListener("close", this.socketClose.bind(this));
	}

	private socketOpen(_event: Event) {
		// Do nothing
	}

	private socketMessage(event: MessageEvent) {
		const data = event.data;
		const str = data.toString();
		const message = JSON.parse(str) as ServerMessage;
	
		this.messageHook.run(message);
	}

	private socketError(event: Event) {
		console.error(event);
	}

	private socketClose(event: CloseEvent) {
		console.warn(event);
	}

	listen(callback: HookFunc<ServerMessage>) {
		this.messageHook.register(callback);
	}

	socketSend(message: ClientMessage): boolean {
		// Check that we are connected
		if (this.socket === null) {
			return false;
		}

		// Serialize message
		const messageString = JSON.stringify(message);

		// Attempt to send message
		try {
			this.socket.send(messageString);
			return true;
		} catch (err) {
			console.error({message, err});
			return false;
		}
	}
}
