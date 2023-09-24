import { Comparable } from "../../../common/Comparable.ts";

export class GameStats extends Comparable<GameStats> {
	readonly playersOnlineValue: number;
	readonly jsRenderTimeValue: number;

	static readonly Zero = new GameStats(0, 0);

	private constructor(playersOnline: number, jsRenderTime: number) {
		super();
		this.playersOnlineValue = playersOnline;
		this.jsRenderTimeValue = jsRenderTime;
	}

	playersOnline(newPlayersOnline: number) {
		return new GameStats(newPlayersOnline, this.jsRenderTimeValue);
	}

	jsRenderTime(newJsRenderTime: number) {
		return new GameStats(this.playersOnlineValue, newJsRenderTime);
	}

	equals(other: GameStats): boolean {
		if (this === other) {
			return true;
		} else if (this.playersOnlineValue != other.playersOnlineValue) {
			return false;
		} else if (this.jsRenderTimeValue != other.jsRenderTimeValue) {
			return false;
		} else {
			return true;
		}
	}
}
