import { LowPassFilter } from "../../../common/data-structures/LowPassFilter.ts";
import { ServerStats } from "../../../common/data-types/server.ts";
import { gameEngine, rensets } from "../../../common/settings.ts";

export class GameStats {
	private playersOnline = 0;
	private animationTimeFilter = new LowPassFilter(rensets.fps, rensets.mspf);
	private jsRenderTimeFilter = new LowPassFilter(rensets.fps, rensets.mspf);
	private serverTickFilter = new LowPassFilter(gameEngine.tps, gameEngine.mspt);
	private pingTimeFilter = new LowPassFilter(2, 0);

	recordPlayersOnline(playersOnline: number) {
		this.playersOnline = playersOnline;
	}
	getPlayersOnline(): number {
		return this.playersOnline;
	}

	recordTimeBetweenAnimations(timeTaken: number) {
		this.animationTimeFilter.set(timeTaken);
	}
	getTimeBetweenAnimantions(): number {
		return this.animationTimeFilter.read();
	}

	recordJsRenderTime(timeTaken: number) {
		this.jsRenderTimeFilter.set(timeTaken);
	}
	getJsRenderTime(): number {
		return this.jsRenderTimeFilter.read();
	}

	recordServerStats(serverStats: ServerStats) {
		this.serverTickFilter.set(serverStats.tickMs);
	}
	getServerTickTime(): number {
		return this.serverTickFilter.read();
	}

	recordPingTime(timeTaken: number) {
		this.pingTimeFilter.set(timeTaken);
	}
	getPingTime(): number {
		return this.pingTimeFilter.read();
	}
}
