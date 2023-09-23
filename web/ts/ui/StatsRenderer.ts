import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Text, TextAlign } from "../../../common/shapes/Text.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class StatsRenderer {
	private cwCanvas: CWCanvas;
	private visible: Deferred<boolean>;
	private playersOnline: Deferred<number>;

	constructor(cwCanvas: CWCanvas) {
		this.cwCanvas = cwCanvas;
		this.visible = new Deferred(false);
		this.playersOnline = new Deferred(0);
	}

	toggleVisible() {
		const newVisible = !this.visible.get().latest;
		console.log("toggling " + newVisible);
		this.visible.set(newVisible);
	}

	setPlayersOnline(playersOnline: number) {
		this.playersOnline.set(playersOnline);
	}

	render(screen: Rect) {
		const visibleDiff = this.visible.get();
		const playersOnlineDiff = this.playersOnline.get();

		if (visibleDiff.dirty) {
			this.renderInternal(screen, visibleDiff.latest, playersOnlineDiff.latest);
		} else if (visibleDiff.latest && (playersOnlineDiff.dirty)) {
			this.renderInternal(screen, visibleDiff.latest, playersOnlineDiff.latest);
		}
	}

	forceRender(screen: Rect) {
		const visibleDiff = this.visible.get();
		const playersOnlineDiff = this.playersOnline.get();

		this.renderInternal(screen, visibleDiff.latest, playersOnlineDiff.latest);
	}

	renderInternal(screen: Rect, visible: boolean, playersOnline: number) {
		// const prevPingDelayMs = state.stats.prevPingDelayMs.toFixed(0);
		// const serverTickMs = state.stats.server.tickMs.toFixed(3);
		// const serverTicksPerSec = (1000 / state.stats.server.tickMs).toFixed(0);

		const stats = [
			// `prevPingDelayMs: ${prevPingDelayMs}`,
			// `serverTickMs: ${serverTickMs}`,
			// `serverTicksPerSec: ${serverTicksPerSec}`,
			`playersOnline: ${playersOnline}`
		];

		let rect = new Rect(new Point(10, screen.height-(20*stats.length)-20), new Point(100, screen.height-(20*stats.length)));
		for (const stat of stats) {
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
