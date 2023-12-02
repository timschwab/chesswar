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

		if (visibleDiff.dirty) {
			this.renderInternal(screen, visibleDiff.latest, statsDiff.latest);
		} else if (visibleDiff.latest && statsDiff.dirty) {
			this.renderInternal(screen, visibleDiff.latest, statsDiff.latest);
		}
	}

	forceRender(screen: Rect) {
		const visibleDiff = this.visible.get();
		const statsDiff = this.stats.get();

		this.renderInternal(screen, visibleDiff.latest, statsDiff.latest);
	}

	renderInternal(screen: Rect, visible: boolean, stats: GameStats) {
		const playersOnline = stats.playersOnlineValue;
		const pingTimeMs = stats.pingTimeValue.toFixed(0);
		const serverTickMs = stats.serverTickTimeValue.toFixed(3);
		const serverTicksPerSec = (1000 / stats.serverTickTimeValue).toFixed(0);
		const animationMs = stats.animationTimeValue.toFixed(1);
		const animationPerSec = (1000 / stats.animationTimeValue).toFixed(1);
		const jsRenderTimeMs = stats.jsRenderTimeValue.toFixed(1);

		const statStrings = [
			`playersOnline: ${playersOnline}`,
			`pingTimeMs: ${pingTimeMs}`,
			`serverTickMs: ${serverTickMs}`,
			`serverTicksPerSec: ${serverTicksPerSec}`,
			`animationMs: ${animationMs}`,
			`animationPerSec: ${animationPerSec}`,
			`jsRenderTimeMs: ${jsRenderTimeMs}`,
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
				this.cwCanvas.clearRect(rect.expand(2));
			}
			rect = rect.add(new Point(0, lineHeight));
		}
	}
}
