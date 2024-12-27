import { LowPassFilter } from "../../../common/data-structures/LowPassFilter.ts";
import { ServerStats } from "../../../common/data-types/server.ts";
import { gameEngine, rensets } from "../../../common/settings.ts";
import { state } from "./state.ts";

const animationTimeFilter = new LowPassFilter(rensets.fps, rensets.mspf);
const renderTimeFilter = new LowPassFilter(rensets.fps, rensets.mspf);
const jsRenderTimeFilter = new LowPassFilter(rensets.fps, rensets.mspf);
const serverTickFilter = new LowPassFilter(gameEngine.tps, gameEngine.mspt);
const pingTimeFilter = new LowPassFilter(2, 0);

const stats = state.ui.stats;

export function recordPlayersOnline(playersOnline: number) {
	stats.data = stats.data.playersOnline(playersOnline);
}

export function recordTimeBetweenAnimations(timeTaken: number) {
	animationTimeFilter.set(timeTaken);
	stats.data = stats.data.animationTime(animationTimeFilter.read());
}

export function recordRenderTime(timeTaken: number) {
	renderTimeFilter.set(timeTaken);
	stats.data = stats.data.renderTime(renderTimeFilter.read());
}

export function recordJsRenderTime(timeTaken: number) {
	jsRenderTimeFilter.set(timeTaken);
	stats.data = stats.data.jsRenderTime(jsRenderTimeFilter.read());
}

export function recordServerStats(serverStats: ServerStats) {
	serverTickFilter.set(serverStats.tickMs);
	stats.data = stats.data.serverTickTime(serverTickFilter.read());
}

export function recordPingTime(timeTaken: number) {
	pingTimeFilter.set(timeTaken);
	stats.data = stats.data.pingTime(pingTimeFilter.read());
}
