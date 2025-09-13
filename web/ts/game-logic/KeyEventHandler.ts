import { ClientMessageTypes, MoveMessagePayload } from "../../../common/message-types/client.ts";
import { CWClientSocket } from "../core/CWClientSocket.ts";
import { CWInput, CWKey, CWKeyEvent } from "../core/CWInput.ts";
import { state } from "./state.ts";

export class KeyEventHandler {
	private readonly input: CWInput;
	private readonly socket: CWClientSocket;
	private readonly movement: MoveMessagePayload;

	constructor(input: CWInput, socket: CWClientSocket) {
		this.input = input;
		this.socket = socket;
		this.movement = {
			left: false,
			right: false,
			up: false,
			down: false
		};
	}

	start() {
		this.input.listenKey(this.handleKeyEvent.bind(this));
	}

	private handleKeyEvent(event: CWKeyEvent) {
		const key = event.key;
		
			switch (key) {
				case CWKey.ACTION:
					if (event.pressed) {
						this.socket.socketSend({
							type: ClientMessageTypes.ACTION,
							payload: null
						});
					}
					break;
				case CWKey.STATS:
					if (event.pressed) {
						state.ui.statsShowing = !state.ui.statsShowing;
					}
					break;
				case CWKey.UP:
				case CWKey.DOWN:
				case CWKey.LEFT:
				case CWKey.RIGHT:
					this.movement[key] = event.pressed;
					this.socket.socketSend({
						type: ClientMessageTypes.MOVE,
						payload: this.movement
					});
			}
	}
}
