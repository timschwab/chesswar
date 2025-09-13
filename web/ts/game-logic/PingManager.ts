import { ClientMessageTypes } from "../../../common/message-types/client.ts";
import { CWClientSocket } from "../core/CWClientSocket.ts";
import { recordPingTime } from "./statsManager.ts";

const NEW_PING_DELAY_MS = 1000;

export class PingManager {
	private readonly socket: CWClientSocket;
	private pingTime = 0;

	constructor(socket: CWClientSocket) {
		this.socket = socket;
	}

	start() {
		setTimeout(this.ping.bind(this), NEW_PING_DELAY_MS);
	}

	private ping() {
		this.pingTime = performance.now();
		this.socket.socketSend({
				type: ClientMessageTypes.PING,
				payload: null
			});
	}

	pong() {
		const pongTime = performance.now();
		const diff = pongTime - this.pingTime;

		recordPingTime(diff);

		setTimeout(this.ping.bind(this), NEW_PING_DELAY_MS);
	}
}
