import { Comparable } from "../../../common/Comparable.ts";

export class GameStats extends Comparable<GameStats> {
	readonly playersOnlineValue: number;
	readonly jsRenderTimeValue: number;
	readonly serverTickTimeValue: number;

	static readonly Zero = new GameStats(0, 0, 0);

	private constructor(playersOnline: number, jsRenderTime: number, serverTickTime: number) {
		super();
		this.playersOnlineValue = playersOnline;
		this.jsRenderTimeValue = jsRenderTime;
		this.serverTickTimeValue = serverTickTime;
	}

	playersOnline(newPlayersOnline: number) {
		return new GameStats(newPlayersOnline, this.jsRenderTimeValue, this.serverTickTimeValue);
	}

	jsRenderTime(newJsRenderTime: number) {
		return new GameStats(this.playersOnlineValue, newJsRenderTime, this.serverTickTimeValue);
	}

	serverTickTime(newServerTickTime: number) {
		return new GameStats(this.playersOnlineValue, this.jsRenderTimeValue, newServerTickTime);
	}

	equals(other: GameStats): boolean {
		if (this === other) {
			return true;
		} else if (this.playersOnlineValue != other.playersOnlineValue) {
			return false;
		} else if (this.jsRenderTimeValue != other.jsRenderTimeValue) {
			return false;
		} else if (this.serverTickTimeValue != other.serverTickTimeValue) {
			return false;
		} else {
			return true;
		}
	}
}
