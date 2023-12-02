import { ClientMessageTypes } from "../../../common/message-types/client.ts";
import { socketSend } from "../core/socket.ts";
import { recordPingTime } from "./statsManager.ts";

let pingTime = 0;
const newPingDelayMs = 500;

export function beginPings() {
	setTimeout(ping, newPingDelayMs);
}

function ping() {
	pingTime = performance.now();
	socketSend({
		type: ClientMessageTypes.PING,
		payload: null
	});
}

export function reportPong() {
	const pongTime = performance.now();
	const diff = pongTime-pingTime;
	recordPingTime(diff);

	setTimeout(ping, newPingDelayMs);
}
