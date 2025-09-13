import { ClientMessageTypes } from "../../../common/message-types/client.ts";
import { CWClientSocket } from "../core/CWClientSocket.ts";
import { GameStats } from "./GameStats.ts";

const NEW_PING_DELAY_MS = 1000;

export class PingManager {
	private readonly socket: CWClientSocket;
	private readonly statsManager: GameStats;
	private pingTime = 0;

	constructor(socket: CWClientSocket, statsManager: GameStats) {
		this.socket = socket;
		this.statsManager = statsManager;
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

		this.statsManager.recordPingTime(diff);

		setTimeout(this.ping.bind(this), NEW_PING_DELAY_MS);
	}
}
