import socket from "./socket.ts";
import state from "./state.ts";
import { receiveMessage } from "./messages.ts";

export function initGame() {
	socket.listen(receiveMessage);
	gameLoop();
}

function gameLoop() {
	state.count++;
	requestAnimationFrame(gameLoop);
}

// function ping() {
// 	if (state.count > state.stats.nextPingCount) {
// 		state.stats.nextPingCount = Infinity;
// 		state.stats.thisPingSend = performance.now();
// 		socket.send({
// 			type: ClientMessageTypes.PING,
// 			payload: null
// 		});
// 	}
// }
