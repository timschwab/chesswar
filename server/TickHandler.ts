import { TeamName } from "../common/data-types/base.ts";
import { SerializedClientPlayer } from "../common/data-types/client.ts";
import { ServerMessageTypes, TeamMessage, TeamMessagePayload } from "../common/message-types/server.ts";
import { addPlayer } from "./events.ts";
import { SocketManager } from "./SocketManager.ts";
import { getState, resetState, ServerPlayer } from "./state.ts";
import { tickNewGame, tickPlayers, tickTankKills, tickVictory } from "./tick.ts";

export class TickHandler {
	private readonly socketManager: SocketManager;

	constructor(socketManager: SocketManager) {
		this.socketManager = socketManager;
	}

	tick() {
		try {
			const startTick = performance.now();
			this.tickAll();
			const endTick = performance.now();
			const tickMs = endTick-startTick;
			getState().stats.tickMs = tickMs;
			if (tickMs > 25) {
				console.warn("Long tick warning: " + tickMs);
			}
		} catch (ex) {
			console.error("Error occurred while server ticking");
			console.error(ex);
		}
	}

	private tickAll() {
		if (getState().newGameCounter == 0) {
			this.resetGame();
		}
		const state = getState();
	
		tickPlayers(this.socketManager);
		tickTankKills(this.socketManager);
	
		if (state.victory == null) {
			tickVictory();
		} else {
			tickNewGame();
		}
	
		// Broadcast state to everyone
		const playerList = Array.from(state.allPlayers.values());
		const payload = {
			players: playerList.map(this.serverPlayerToClientPlayer),
			victory: state.victory,
			newGameCounter: state.newGameCounter
		};
	
		this.socketManager.sendAll({
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
	
			this.socketManager.sendBulk(teamPlayerIds, teamMessage);
		}
	
		// Broadcast stats
		this.socketManager.sendAll({
			type: ServerMessageTypes.STATS,
			payload: state.stats
		});
	
		state.count++;
	}

	private serverPlayerToClientPlayer(player: ServerPlayer): SerializedClientPlayer {
		return {
			id: player.id,
			team: player.team,
			role: player.role,
			actionOption: player.actionOption,
			position: player.physics.position.serialize(),
			deathCounter: player.deathCounter
		};
	}

	private resetGame() {
		// Store player IDs
		const players = getState().allPlayers.keys();
	
		// Reset state
		resetState();
	
		// Add all players
		for (const player of players) {
			addPlayer(this.socketManager, player);
		}
	}
}
