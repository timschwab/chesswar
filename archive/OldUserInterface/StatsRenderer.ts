import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { ZeroRect } from "../../../../common/shapes/Zero.ts";
import { bindToScreen } from "../../core/screen.ts";
import { SafeState } from "../../game-logic/state.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { UiComponentRenderer } from "./UiComponentRenderer.ts";

const FONT_SIZE = 0.125;

export class StatsRenderer implements UiComponentRenderer {
	private readonly glyphBoundingBox;
	private screen: Rect = ZeroRect;

	private stats: CWText[] = [];

	constructor(glyphBoundingBox: Rect) {
		this.glyphBoundingBox = glyphBoundingBox;

		bindToScreen(screenValue => { this.screen = screenValue });
	}

	setState(state: SafeState): void {
		if (!state.ui.stats.showing) {
			this.stats = [];
			return;
		}

		const stats = state.ui.stats.data;

		const playersOnline = stats.playersOnlineValue;
		const pingTimeMs = stats.pingTimeValue.toFixed(0);
		const serverTickMs = stats.serverTickTimeValue.toFixed(3);
		const serverTicksPerSec = (1000 / stats.serverTickTimeValue).toFixed(0);
		const timeBetweenAnimationsMs = stats.timeBetweenAnimationsValue.toFixed(1);
		const animationPerSec = (1000 / stats.timeBetweenAnimationsValue).toFixed(1);
		const jsRenderTimeMs = stats.jsRenderTimeValue.toFixed(1);

		const statStrings = [
			`playersOnline: ${playersOnline}`,
			`pingTimeMs: ${pingTimeMs}`,
			`serverTickMs: ${serverTickMs}`,
			`serverTicksPerSec: ${serverTicksPerSec}`,
			`timeBetweenAnimationsMs: ${timeBetweenAnimationsMs}`,
			`animationPerSec: ${animationPerSec}`,
			`jsRenderTimeMs: ${jsRenderTimeMs}`,
		];

		const lineHeight = this.glyphBoundingBox.height*FONT_SIZE;
		const statsTop = this.screen.bottom - (lineHeight*(statStrings.length+1));

		const statTextData = statStrings.map((statString, index) => {
			const leftTop = new Point(10, statsTop + (lineHeight*index));
			return new CWText(statString, leftTop, FONT_SIZE, rensets.stats.color);
		});

		this.stats = statTextData;
	}

	getStructures(): Structure[] {
		return [];
	}
	
	getTextData(): CWText[] {
		return this.stats;
	};
}
