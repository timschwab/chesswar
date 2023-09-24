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
		const jsRenderTimeMs = stats.jsRenderTimeValue.toFixed(1);
		// const prevPingDelayMs = state.stats.prevPingDelayMs.toFixed(0);
		// const serverTickMs = state.stats.server.tickMs.toFixed(3);
		// const serverTicksPerSec = (1000 / state.stats.server.tickMs).toFixed(0);
		const playersOnline = stats.playersOnlineValue;

		const statStrings = [
			`jsRenderTimeMs ${jsRenderTimeMs}`,
			// `prevPingDelayMs: ${prevPingDelayMs}`,
			// `serverTickMs: ${serverTickMs}`,
			// `serverTicksPerSec: ${serverTicksPerSec}`,
			`playersOnline: ${playersOnline}`
		];

		const lineHeight = 20;
		const lineWidth = 200;
		const statsTop = screen.height - (lineHeight*(statStrings.length+1));
		let rect = new Rect(new Point(10, statsTop), new Point(10+lineWidth, statsTop+lineHeight));
		for (const stat of statStrings) {
			if (visible) {
				const statText = new Text(rect, stat, TextAlign.LEFT, rensets.stats.font, rensets.stats.color);
				this.cwCanvas.clearRect(rect);
				this.cwCanvas.text(statText);
			} else {
				this.cwCanvas.clearRect(rect);
			}
			rect = rect.add(new Point(0, lineHeight));
		}
	}
}
