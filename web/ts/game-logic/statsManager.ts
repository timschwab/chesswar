import { LowPassFilter } from "../../../common/data-structures/LowPassFilter.ts";
import { ServerStats } from "../../../common/data-types/server.ts";
import { ui } from "../ui/ui.ts";
import { GameStats } from "./GameStats.ts";

const lowPassStrength = 10;

const jsRenderTimeFilter = new LowPassFilter(lowPassStrength);
const serverTickFilter = new LowPassFilter(lowPassStrength);
const pingTimeFilter = new LowPassFilter(lowPassStrength);

let stats = GameStats.Zero;

export function recordPlayersOnline(playersOnline: number) {
	stats = stats.playersOnline(playersOnline);
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