import { ClientMessageTypes, MoveMessagePayload } from "../../../common/message-types/client.ts";
import { CWKey, CWKeyEvent } from "../core/CWInput.ts";
import { socketSend } from "../core/socket.ts";
import { state } from "./state.ts";

const movement: MoveMessagePayload = {
	left: false,
	right: false,
	up: false,
	down: false
};

export function handleKey(event: CWKeyEvent) {
	const key = event.key;

	switch (key) {
		case CWKey.ACTION:
			if (event.pressed) {
				socketSend({
					type: ClientMessageTypes.ACTION,
					payload: null
				});
			}
			break;
		case CWKey.STATS:
			if (event.pressed) {
				state.ui.stats.showing = !state.ui.stats.showing;
			}
			break;
		case CWKey.UP:
		case CWKey.DOWN:
		case CWKey.LEFT:
		case CWKey.RIGHT:
			movement[key] = event.pressed;
			socketSend({
				type: ClientMessageTypes.MOVE,
				payload: movement
			});
	}
}
