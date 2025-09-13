import { ClientMessageTypes, MoveMessagePayload } from "../../../common/message-types/client.ts";
import { CWClientSocket } from "../core/CWClientSocket.ts";
import { CWInput, CWKey, CWKeyEvent } from "../core/CWInput.ts";
import { ChesswarState } from "./ChesswarState.ts";

export class KeyEventHandler {
	private readonly state: ChesswarState;
	private readonly input: CWInput;
	private readonly socket: CWClientSocket;
	private readonly movement: MoveMessagePayload;

	constructor(state: ChesswarState, input: CWInput, socket: CWClientSocket) {
		this.state = state;
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
						this.state.toggleStatsShowing();
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
