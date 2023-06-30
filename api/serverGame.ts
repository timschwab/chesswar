import socket from "./socket.ts";
import { ServerMessageTypes, TeamMessage, TeamMessagePayload } from "../common/message-types/server.ts";
import { ClientPlayer } from "../common/data-types/client.ts";
import state, { ServerPlayer } from "./state.ts";
import { tickNewGame, tickPlayers, tickTankKills, tickVictory } from "./tick.ts";
import { addPlayer, receiveMessage, removePlayer } from "./events.ts";
import { TeamName } from "../common/data-types/base.ts";
import { gameEngine } from "../common/settings.ts";

function init() {
	// Set up events
	socket.listen.add(addPlayer);
	socket.listen.remove(removePlayer);
	socket.listen.message(receiveMessage);

	// Set up ticking
	const msPerTick = 1000/gameEngine.ticksPerSecond;
	setInterval(tick, msPerTick);
}

function tick(): void {
	const startTick = performance.now();
	tickAll();
	const endTick = performance.now();
	const tickMs = endTick-startTick;
	state.stats.tickMs = tickMs;
}

function tickAll(): void {
	tickPlayers();
	tickTankKills();

	if (state.victory == null) {
		tickVictory();
	} else {
		tickNewGame();
	}

	// Broadcast state to everyone
	const playerList = Array.from(state.allPlayers.values());
	const payload = {
		players: playerList.map(serverPlayerToClientPlayer),
		victory: state.victory,
		newGameCounter: state.newGameCounter
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
			briefings: team.briefings,
			enemyBriefings: team.enemyBriefings
		};
		const teamMessage: TeamMessage = {
			type: ServerMessageTypes.TEAM,
			payload: teamPayload
		};

		socket.sendBulk(teamPlayerIds, teamMessage);
	}

	// Broadcast stats to everyone once a second
	if (state.count % 20 == 0) {
		socket.sendAll({
			type: ServerMessageTypes.STATS,
			payload: state.stats
		});
	}

	state.count++;
}

function serverPlayerToClientPlayer(player: ServerPlayer): ClientPlayer {
	return {
		id: player.id,
		team: player.team,
		role: player.role,
		actionOption: player.actionOption,
		position: player.physics.position,
		deathCounter: player.deathCounter
	};
}

export default {
	init
};
