import { Comparable } from "../../../common/Comparable.ts";

export class GameStats extends Comparable<GameStats> {
	readonly playersOnlineValue: number;
	readonly timeBetweenAnimationsValue: number;
	readonly renderTimeValue: number;
	readonly jsRenderTimeValue: number;
	readonly serverTickTimeValue: number;
	readonly pingTimeValue: number;

	static readonly Zero = new GameStats(0, 0, 0, 0, 0, 0);

	private constructor(playersOnline: number, animationTime: number, renderTimeValue: number, jsRenderTime: number, serverTickTime: number, pingTime: number) {
		super();
		this.playersOnlineValue = playersOnline;
		this.timeBetweenAnimationsValue = animationTime;
		this.renderTimeValue = renderTimeValue;
		this.jsRenderTimeValue = jsRenderTime;
		this.serverTickTimeValue = serverTickTime;
		this.pingTimeValue = pingTime
	}

	playersOnline(newPlayersOnline: number) {
		return new GameStats(
			newPlayersOnline,
			this.timeBetweenAnimationsValue, this.renderTimeValue, this.jsRenderTimeValue,
			this.serverTickTimeValue, this.pingTimeValue);
	}

	animationTime(newAnimationTime: number) {
		return new GameStats(
			this.playersOnlineValue,
			newAnimationTime, this.renderTimeValue, this.jsRenderTimeValue,
			this.serverTickTimeValue, this.pingTimeValue);
	}

	renderTime(newRenderTime: number) {
		return new GameStats(
			this.playersOnlineValue,
			this.timeBetweenAnimationsValue, newRenderTime, this.jsRenderTimeValue,
			this.serverTickTimeValue, this.pingTimeValue);
	}

	jsRenderTime(newJsRenderTime: number) {
		return new GameStats(
			this.playersOnlineValue,
			this.timeBetweenAnimationsValue, this.renderTimeValue, newJsRenderTime,
			this.serverTickTimeValue, this.pingTimeValue);
	}

	serverTickTime(newServerTickTime: number) {
		return new GameStats(
			this.playersOnlineValue,
			this.timeBetweenAnimationsValue, this.renderTimeValue, this.jsRenderTimeValue,
			newServerTickTime, this.pingTimeValue);
	}

	pingTime(newPingTime: number) {
		return new GameStats(
			this.playersOnlineValue,
			this.timeBetweenAnimationsValue, this.renderTimeValue, this.jsRenderTimeValue,
			this.serverTickTimeValue, newPingTime);
	}

	equals(other: GameStats): boolean {
		if (this === other) {
			return true;
		} else if (this.playersOnlineValue !== other.playersOnlineValue) {
			return false;
		} else if (this.timeBetweenAnimationsValue !== other.timeBetweenAnimationsValue) {
			return false;
		} else if (this.renderTimeValue !== other.renderTimeValue) {
			return false;
		} else if (this.jsRenderTimeValue !== other.jsRenderTimeValue) {
			return false;
		} else if (this.serverTickTimeValue !== other.serverTickTimeValue) {
			return false;
		} else if (this.pingTimeValue !== other.pingTimeValue) {
			return false;
		} else {
			return true;
		}
	}
}
