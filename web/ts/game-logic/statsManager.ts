import { LowPassFilter } from "../../../common/data-structures/LowPassFilter.ts";
import { ServerStats } from "../../../common/data-types/server.ts";
import { gameEngine, rensets } from "../../../common/settings.ts";
import { ui } from "../ui/ui.ts";
import { GameStats } from "./GameStats.ts";

const animationTimeFilter = new LowPassFilter(rensets.fps, rensets.mspf);
const jsRenderTimeFilter = new LowPassFilter(rensets.fps, rensets.mspf);
const serverTickFilter = new LowPassFilter(gameEngine.tps, gameEngine.mspt);
const pingTimeFilter = new LowPassFilter(2, 0);

let stats = GameStats.Zero;

export function recordPlayersOnline(playersOnline: number) {
	stats = stats.playersOnline(playersOnline);
	setStats();
}

export function recordAnimationTime(timeTaken: number) {
	animationTimeFilter.set(timeTaken);
	stats = stats.animationTime(animationTimeFilter.read());
	setStats();
}

export function recordJsRenderTime(timeTaken: number) {
	jsRenderTimeFilter.set(timeTaken);
	stats = stats.jsRenderTime(jsRenderTimeFilter.read());
	setStats();
}

export function recordServerStats(serverStats: ServerStats) {
	serverTickFilter.set(serverStats.tickMs);
	stats = stats.serverTickTime(serverTickFilter.read());
	setStats();
}

export function recordPingTime(timeTaken: number) {
	pingTimeFilter.set(timeTaken);
	stats = stats.pingTime(pingTimeFilter.read());
	setStats();
}

function setStats() {
	ui.stats.setStats(stats);
}