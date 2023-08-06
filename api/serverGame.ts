import socket from "./socket.ts";
import { ServerMessageTypes, TeamMessage, TeamMessagePayload } from "../common/message-types/server.ts";
import { SerializedClientPlayerState } from "../common/data-types/client.ts";
import { ServerPlayer, getState, resetState } from "./state.ts";
import { tickNewGame, tickPlayers, tickTankKills, tickVictory } from "./tick.ts";
import { addPlayer, receiveMessage, removePlayer } from "./events.ts";
import { TeamName } from "../common/data-types/base.ts";
import { gameEngine } from "../common/settings.ts";

export function initGame() {
	// Set up events
	socket.listen.add(addPlayer);
	socket.listen.remove(removePlayer);
	socket.listen.message(receiveMessage);

	// Set up ticking
	const msPerTick = 1000/gameEngine.ticksPerSecond;
	setInterval(tick, msPerTick);
}

function tick(): void {
	try {
		const startTick = performance.now();
		tickAll();
		const endTick = performance.now();
		const tickMs = endTick-startTick;
		getState().stats.tickMs = tickMs;
		if (tickMs > 10) {
			console.warn("Long tick warning: " + tickMs);
		}
	} catch (ex) {
		console.error("Error occurred while server ticking");
		console.error(ex);
	}
}

function tickAll(): void {
	if (getState().newGameCounter == 0) {
		resetGame();
	}
	const state = getState();

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

function serverPlayerToClientPlayer(player: ServerPlayer): SerializedClientPlayerState {
	return {
		id: player.id,
		team: player.team,
		role: player.role,
		actionOption: player.actionOption,
		position: player.physics.position.serialize(),
		deathCounter: player.deathCounter
	};
}

function resetGame() {
	// Store player IDs
	const players = getState().allPlayers.keys();

	// Reset state
	resetState();

	// Add all players
	for (const player of players) {
		addPlayer(player);
	}
}
