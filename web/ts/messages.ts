import { DeathCause, PlayerAction } from "../../common/data-types/base.ts";
import { CarryingMessagePayload, PlayerInitMessagePayload, ServerMessage, ServerMessageTypes, StateMessagePayload, StatsMessagePayload, TeamMessagePayload } from "../../common/message-types/server.ts";

export function receiveMessage(message: ServerMessage): void {
	if (message.type == ServerMessageTypes.PLAYER_INIT) {
		handlePlayerInit(message.payload);
	} else if (message.type == ServerMessageTypes.STATE) {
		handleState(message.payload);
	} else if (message.type == ServerMessageTypes.TEAM) {
		handleTeam(message.payload);
	} else if (message.type == ServerMessageTypes.ACTION_COMPLETED) {
		handleCompletedAction(message.payload);
	} else if (message.type == ServerMessageTypes.CARRYING) {
		handleCarrying(message.payload);
	} else if (message.type == ServerMessageTypes.DEATH) {
		handleDeath(message.payload);
	} else if (message.type == ServerMessageTypes.PONG) {
		handlePong();
	} else if (message.type == ServerMessageTypes.STATS) {
		handleStats(message.payload);
	}
}

function handlePlayerInit(payload: PlayerInitMessagePayload) {
	// state.selfId = payload.id;
}

function handleState(payload: StateMessagePayload) {
	// for (const sentPlayer of payload.players) {
	// 	// New players
	// 	const storedPlayer = state.playerMap.get(sentPlayer.id);
	// 	if (storedPlayer == null) {
	// 		const newPlayer = {
	// 			id: sentPlayer.id,
	// 			team: sentPlayer.team,
	// 			role: sentPlayer.role,
	// 			actionOption: sentPlayer.actionOption,
	// 			position: new DiffStore<Circle>(),
	// 			deathCounter: sentPlayer.deathCounter
	// 		};
	// 		newPlayer.position.store(Circle.deserialize(sentPlayer.position));

	// 		state.playerMap.set(sentPlayer.id, newPlayer);
	// 	} else {
	// 		// Existing players
	// 		storedPlayer.role = sentPlayer.role;
	// 		storedPlayer.actionOption = sentPlayer.actionOption;
	// 		storedPlayer.position.store(Circle.deserialize(sentPlayer.position));
	// 		storedPlayer.deathCounter = sentPlayer.deathCounter;
	// 	}

	// 	// Old players
	// 	const sent = new Set(payload.players.map(p => p.id));
	// 	for (const player of state.playerMap.values()) {
	// 		if (!sent.has(player.id)) {
	// 			console.log("Removed: ", player);
	// 			state.playerMap.delete(player.id);
	// 			state.removedPlayers.enqueue(player);
	// 		}
	// 	}

	// }

	// if (state.selfId) {
	// 	const maybeSelf = state.playerMap.get(state.selfId);

	// 	if (!maybeSelf) {
	// 		console.error(state.playerMap, state.selfId);
	// 		throw "Could not find self";
	// 	}

	// 	state.self = maybeSelf;
	// 	const selfPos = state.self.position.value();
	// 	if (selfPos != null) {
	// 		scene.setCameraCenter(selfPos.center);
	// 	}
	// }

	// state.victory = payload.victory;
	// state.newGameCounter = payload.newGameCounter;
}

function handleTeam(payload: TeamMessagePayload) {
	// state.teamBoard.store(payload.board);

	// state.briefings = payload.briefings;
	// state.enemyBriefings = payload.enemyBriefings;
}

function handleCompletedAction(action: PlayerAction) {
	// if (action == PlayerAction.GRAB_ORDERS) {
	// 	audioPlayer.grabOrders();
	// } else if (action == PlayerAction.COMPLETE_ORDERS) {
	// 	audioPlayer.completeOrders();
	// }
}

function handleCarrying(payload: CarryingMessagePayload) {
	// state.carrying = payload;
}

function handleDeath(cause: DeathCause) {
	// if (cause == DeathCause.MINEFIELD) {
	// 	audioPlayer.minefieldDeath();
	// } else if (cause == DeathCause.TANK) {
	// 	audioPlayer.tankDeath();
	// }
}

function handlePong() {
	// state.stats.thisPongRecv = performance.now();
	// state.stats.prevPingDelayMs = state.stats.thisPongRecv - state.stats.thisPingSend;
	// state.stats.nextPingCount = state.count + 60; // 1 second between pong recvs and ping sends
}

function handleStats(payload: StatsMessagePayload) {
	// state.stats.server = payload;
}
