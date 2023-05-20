import socket from "./socket.ts";
import { ServerMessageTypes, TeamMessage, TeamMessagePayload } from "../common/message-types/types-server.ts";
import { ClientPlayer } from "../common/data-types/types-client.ts";
import state, { ServerPlayer } from "./state.ts";
import { tickPlayers } from "./tick.ts";
import { addPlayer, receiveMessage, removePlayer } from "./events.ts";
import { TeamName } from "../common/data-types/types-base.ts";

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
	// Other stuff eventually (maybe)

	// Broadcast state to everyone
	const playerList = Array.from(state.allPlayers.values());
	const payload = {
		players: playerList.map(serverPlayerToClientPlayer)
	};

	socket.sendAll({
		type: ServerMessageTypes.STATE,
		payload: payload
	});

	// Broadcast team state to each team
	for (const name of Object.values(TeamName)) {
		const team = state[name];
		const teamPlayerIds = Array.from(team.playerMap.values()).map(player => player.id);
		const teamPayload: TeamMessagePayload = {
			board: team.teamBoard,
			briefings: team.briefings
		};
		const teamMessage: TeamMessage = {
			type: ServerMessageTypes.TEAM,
			payload: teamPayload
		};

		socket.sendBulk(teamPlayerIds, teamMessage);
	}
}

function serverPlayerToClientPlayer(player: ServerPlayer): ClientPlayer {
	return {
		id: player.id,
		team: player.team,
		role: player.role,
		commandOption: player.commandOption,
		position: player.physics.position
	};
}

export default {
	init
};
