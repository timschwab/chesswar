import { ChesswarId } from "../../common/data-types/base.ts";
import { ClientPlayer } from "../../common/data-types/client.ts";
import { PlayerInitMessagePayload, StateMessagePayload, StatsMessagePayload, TeamMessagePayload } from "../../common/message-types/server.ts";
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
}

export function handleTeam(payload: TeamMessagePayload) {
	state.teamBoard = payload.board;
	state.briefings = payload.briefings;
}

export function handlePong() {
	state.stats.thisPongRecv = performance.now();
	state.stats.nextPingCount = state.count + 60; // 1 second between pong recvs and ping sends
}

export function handleStats(payload: StatsMessagePayload) {
	state.stats.server = payload;
}
