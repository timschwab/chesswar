import { ui } from "../ui/ui.ts";
import { GameStats } from "./GameStats.ts";

const lowPassStrength = 10;

let stats = GameStats.Zero;

export function recordPlayersOnline(playersOnline: number) {
	stats = stats.playersOnline(playersOnline);
	setStats();
}

export function recordJsRenderTime(timeTaken: number) {
	// Low pass filter
	// https://stackoverflow.com/a/5111475/1455074
	const diff = timeTaken - stats.jsRenderTimeValue;
	const newTime = stats.jsRenderTimeValue + (diff/lowPassStrength);
	stats = stats.jsRenderTime(newTime);
	setStats();
}

function setStats() {
	ui.stats.setStats(stats);
}