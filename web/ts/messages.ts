import { ChesswarId } from "../../common/data-types/base.ts";
import { CarryLoadType } from "../../common/data-types/carryLoad.ts";
import { ClientPlayer } from "../../common/data-types/client.ts";
import { CarryingMessagePayload, PlayerInitMessagePayload, StateMessagePayload, StatsMessagePayload, TeamMessagePayload } from "../../common/message-types/server.ts";
import audioPlayer from "./audioPlayer.ts";
import state, { PlayerMap } from "./state.ts";

export function handlePlayerInit(payload: PlayerInitMessagePayload) {
	state.selfId = payload.id;
}

export function handleState(payload: StateMessagePayload) {
	const playerMap: PlayerMap = new Map<ChesswarId, ClientPlayer>();
	for (const player of payload.players) {
		playerMap.set(player.id, player);
	}

	state.playerMap = playerMap;

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
	state.teamBoard = payload.board;
	state.briefings = payload.briefings;
	state.enemyBriefings = payload.enemyBriefings;
}

export function handleCarrying(payload: CarryingMessagePayload) {
	if (payload.type == CarryLoadType.ORDERS) {
		audioPlayer.grabOrders();
	} else if (payload.type == CarryLoadType.EMPTY) {
		if (state.carrying.type == CarryLoadType.ORDERS) {
			audioPlayer.completeOrders();
		}
	}

	state.carrying = payload;
}

export function handlePong() {
	state.stats.thisPongRecv = performance.now();
	state.stats.prevPingDelayMs = state.stats.thisPongRecv - state.stats.thisPingSend;
	state.stats.nextPingCount = state.count + 60; // 1 second between pong recvs and ping sends
}

export function handleStats(payload: StatsMessagePayload) {
	state.stats.server = payload;
}
