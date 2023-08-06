import { DeathCause, PlayerAction } from "../../common/data-types/base.ts";
import { CarryingMessagePayload, PlayerInitMessagePayload, StateMessagePayload, StatsMessagePayload, TeamMessagePayload } from "../../common/message-types/server.ts";
import { Circle } from "../../common/shapes/Circle.ts";
import audioPlayer from "./audioPlayer.ts";
import { DiffStore } from "./diffStore.ts";
import state from "./state.ts";

export function handlePlayerInit(payload: PlayerInitMessagePayload) {
	state.selfId = payload.id;
}

export function handleState(payload: StateMessagePayload) {
	for (const sentPlayer of payload.players) {
		const storedPlayer = state.playerMap.get(sentPlayer.id);
		if (storedPlayer == null) {
			const newPlayer = {
				id: sentPlayer.id,
				team: sentPlayer.team,
				role: sentPlayer.role,
				actionOption: sentPlayer.actionOption,
				position: new DiffStore<Circle>(),
				deathCounter: sentPlayer.deathCounter
			};
			newPlayer.position.store(Circle.deserialize(sentPlayer.position));

			state.playerMap.set(sentPlayer.id, newPlayer);
		} else {
			storedPlayer.role = sentPlayer.role;
			storedPlayer.actionOption = sentPlayer.actionOption;
			storedPlayer.position.store(Circle.deserialize(sentPlayer.position));
			storedPlayer.deathCounter = sentPlayer.deathCounter;

		}
	}

	if (state.selfId) {
		const maybeSelf = state.playerMap.get(state.selfId);

		if (!maybeSelf) {
			console.error(state.playerMap, state.selfId);
			throw "Could not find self";
		}

		state.self = maybeSelf;
	}

	state.victory = payload.victory;
	state.newGameCounter = payload.newGameCounter;
}

export function handleTeam(payload: TeamMessagePayload) {
	state.teamBoard.store(payload.board);

	state.briefings = payload.briefings;
	state.enemyBriefings = payload.enemyBriefings;
}

export function handleCompletedAction(action: PlayerAction) {
	if (action == PlayerAction.GRAB_ORDERS) {
		audioPlayer.grabOrders();
	} else if (action == PlayerAction.COMPLETE_ORDERS) {
		audioPlayer.completeOrders();
	}
}

export function handleCarrying(payload: CarryingMessagePayload) {
	state.carrying = payload;
}

export function handleDeath(cause: DeathCause) {
	if (cause == DeathCause.MINEFIELD) {
		audioPlayer.minefieldDeath();
	} else if (cause == DeathCause.TANK) {
		audioPlayer.tankDeath();
	}
}

export function handlePong() {
	state.stats.thisPongRecv = performance.now();
	state.stats.prevPingDelayMs = state.stats.thisPongRecv - state.stats.thisPingSend;
	state.stats.nextPingCount = state.count + 60; // 1 second between pong recvs and ping sends
}

export function handleStats(payload: StatsMessagePayload) {
	state.stats.server = payload;
}
