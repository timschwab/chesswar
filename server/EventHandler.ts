import { PlayerAction, PlayerRole, TeamName } from "../common/data-types/base.ts";
import { CarryLoadType } from "../common/data-types/carryLoad.ts";
import { ClientMessageWithId } from "../common/message-types/client.ts";
import { ServerMessageTypes } from "../common/message-types/server.ts";
import { randomChoose } from "../common/random.ts";
import { ZeroCircle, ZeroVector } from "../common/shapes/Zero.ts";
import { receiveMessage } from "./events.ts";
import { SocketManager } from "./SocketManager.ts";
import { spawnPlayer } from "./spawn.ts";
import { getState, ServerPlayer } from "./state.ts";


export class EventHandler {
	private readonly socketManager: SocketManager;

	constructor(socketManager: SocketManager) {
		this.socketManager = socketManager;
	}

	addPlayer(id: string): void {
		const state = getState();
		const team = this.newPlayerTeam();
		const newPlayer: ServerPlayer = {
			id,
			team,
			role: PlayerRole.SOLDIER,
			actionOption: PlayerAction.NONE,
			carrying: {
				type: CarryLoadType.EMPTY,
				load: null
			},
			movement: {
				left: false,
				right: false,
				up: false,
				down: false
			},
			physics: {
				speed: ZeroVector,
				mass: 0,
				position: ZeroCircle
			},
			deathCounter: 0
		}
	
		spawnPlayer(this.socketManager, newPlayer);
	
		state.allPlayers.set(id, newPlayer);
		state[team].playerMap.set(id, newPlayer);
	
		this.socketManager.sendOne(id, {
			type: ServerMessageTypes.PLAYER_INIT,
			payload: {
				id: id
			}
		});
	}

	// Add them to the team with fewer players
	private newPlayerTeam(): TeamName {
		const state = getState();
		if (state[TeamName.BLUE].playerMap.size > state[TeamName.RED].playerMap.size) {
			return TeamName.RED;
		} else if (state[TeamName.BLUE].playerMap.size < state[TeamName.RED].playerMap.size) {
			return TeamName.BLUE;
		} else {
			// Equal numbers of blue and red
			return randomChoose([TeamName.BLUE, TeamName.RED]);
		}
	}

	removePlayer(id: string): void {
		const state = getState();
			try {
				const player = this.getPlayer(id);
				state.allPlayers.delete(id);
				state[player.team].playerMap.delete(id);
			} catch (err) {
				console.error(err);
			}
	}

	receiveMessage(message: ClientMessageWithId): void {
		receiveMessage(this.socketManager, message)
	}

	private getPlayer(id: string): ServerPlayer {
		const state = getState();
		const player = state.allPlayers.get(id);
		if (player) {
			return player;
		} else {
			throw new ReferenceError("Could not find player: " + id);
		}
	}
}
