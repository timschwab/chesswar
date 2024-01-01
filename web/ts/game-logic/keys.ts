import { ClientMessageTypes, MoveMessagePayload } from "../../../common/message-types/client.ts";
import { CWKey, CWKeyEvent } from "../core/inputs.ts";
import { socketSend } from "../core/socket.ts";

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
				// ui.stats.toggleVisible();
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
