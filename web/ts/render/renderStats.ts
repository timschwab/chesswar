import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas, TextAlign } from "../canvas/CWCanvas.ts";
import { SafeState } from "../state.ts";

export function renderStats(state: SafeState, uiCanvas: CWCanvas) {
	const prevPingDelayMs = state.stats.prevPingDelayMs.toFixed(0);
	const serverTickMs = state.stats.server.tickMs.toFixed(3);
	const serverTicksPerSec = (1000 / state.stats.server.tickMs).toFixed(0);
	const playersOnline = String(state.playerMap.size);

	const stats = [
		`prevPingDelayMs: ${prevPingDelayMs}`,
		`serverTickMs: ${serverTickMs}`,
		`serverTicksPerSec: ${serverTicksPerSec}`,
		`playersOnline: ${playersOnline}`
	];

	let rect = new Rect(new Point(10, state.screen.height-(20*stats.length)), new Point(100, state.screen.height-(20*stats.length)-20));
	for (const stat of stats) {
		uiCanvas.text(rect, TextAlign.LEFT, stat, rensets.stats.font, rensets.stats.color);
		rect = new Rect(new Point(rect.leftTop.x, rect.leftTop.y+20), new Point(rect.rightBottom.x, rect.rightBottom.y+20));
	}
}
