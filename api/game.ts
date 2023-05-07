import socket from "./socket.ts";
import { ServerMessageTypes } from "../common/message-types/types-server.ts";
import { ClientPlayer } from "../common/data-types/types-client.ts";
import state, { ServerPlayer } from "./state.ts";
import { tickPlayers } from "./tick.ts";
import { addPlayer, receiveMessage, removePlayer } from "./events.ts";

function init() {
	// Set up events
	socket.listen.add(addPlayer);
	socket.listen.remove(removePlayer);
	socket.listen.message(receiveMessage);

	// Set up ticking
	setInterval(tick, 50);
}

function tick(): void {
	// Tick everything
	tickPlayers();
	// Other stuff eventually

	// Broadcast state to everyone
	const playerList = Array.from(state.allPlayers.values());
	const payload = playerList.map(serverPlayerToClientPlayer);

	socket.broadcast({
		type: ServerMessageTypes.STATE,
		payload: payload
	});
}

function serverPlayerToClientPlayer(player: ServerPlayer): ClientPlayer {
	return {
		id: player.id,
		team: player.team,
		position: player.position
	};
}

export default {
	init
};
