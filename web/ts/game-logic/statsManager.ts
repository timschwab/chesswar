import { LowPassFilter } from "../../../common/data-structures/LowPassFilter.ts";
import { ServerStats } from "../../../common/data-types/server.ts";
import { ui } from "../ui/ui.ts";
import { GameStats } from "./GameStats.ts";

const animationTimeFilter = new LowPassFilter(60);
const jsRenderTimeFilter = new LowPassFilter(60);
const serverTickFilter = new LowPassFilter(20);
const pingTimeFilter = new LowPassFilter(2);

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