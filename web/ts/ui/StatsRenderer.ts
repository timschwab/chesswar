import { ComparableDeferred, SimpleDeferred } from "../../../common/data-structures/Deferred.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Text, TextAlign } from "../../../common/shapes/Text.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";
import { GameStats } from "../game-logic/GameStats.ts";

export class StatsRenderer {
	private cwCanvas: CWCanvas;
	private visible: SimpleDeferred<boolean>;
	private stats: ComparableDeferred<GameStats>;

	constructor(cwCanvas: CWCanvas) {
		this.cwCanvas = cwCanvas;
		this.visible = new SimpleDeferred(false);
		this.stats = new ComparableDeferred(GameStats.Zero);
	}

	toggleVisible() {
		const newVisible = !this.visible.get().latest;
		this.visible.set(newVisible);
	}

	setStats(stats: GameStats) {
		this.stats.set(stats);
	}

	render(screen: Rect) {
		const visibleDiff = this.visible.get();
		const statsDiff = this.stats.get();

		if (visibleDiff.dirty || statsDiff.dirty) {
			this.renderInternal(screen, visibleDiff.latest, statsDiff.latest);
		}
	}

	forceRender(screen: Rect) {
		const visibleDiff = this.visible.get();
		const statsDiff = this.stats.get();

		this.renderInternal(screen, visibleDiff.latest, statsDiff.latest);
	}

	renderInternal(screen: Rect, visible: boolean, stats: GameStats) {
		// const prevPingDelayMs = state.stats.prevPingDelayMs.toFixed(0);
		// const serverTickMs = state.stats.server.tickMs.toFixed(3);
		// const serverTicksPerSec = (1000 / state.stats.server.tickMs).toFixed(0);

		const statStrings = [
			// `prevPingDelayMs: ${prevPingDelayMs}`,
			// `serverTickMs: ${serverTickMs}`,
			// `serverTicksPerSec: ${serverTicksPerSec}`,
			`playersOnline: ${stats.playersOnline}`
		];

		let rect = new Rect(new Point(10, screen.height-(20*statStrings.length)-20), new Point(100, screen.height-(20*statStrings.length)));
		for (const stat of statStrings) {
			if (visible) {
				const statText = new Text(rect, stat, TextAlign.LEFT, rensets.stats.font, rensets.stats.color);
				this.cwCanvas.clearRect(rect);
				this.cwCanvas.text(statText);
			} else {
				this.cwCanvas.clearRect(rect);
			}
			rect = new Rect(new Point(rect.leftTop.x, rect.leftTop.y+20), new Point(rect.rightBottom.x, rect.rightBottom.y+20));
		}
	}
}
