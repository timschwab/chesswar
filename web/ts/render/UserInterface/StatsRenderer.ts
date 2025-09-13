import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { ZeroRect } from "../../../../common/shapes/Zero.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { SafeState } from "../../game-logic/state.ts";
import { StatsManager } from "../../game-logic/StatsManager.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { TextRenderer } from "../../webgl/text/TextRenderer.ts";

const FONT_SIZE = 0.125;

export class StatsRenderer {
	private screen: Rect = ZeroRect;
	private readonly rectangleRenderer: RectangleRenderer;
	private readonly textRenderer: TextRenderer;
	private readonly statsManager: StatsManager;

	constructor(
			rectangleRenderer: RectangleRenderer,
			textRenderer: TextRenderer,
			screen: CWScreen,
			statsManager: StatsManager
	) {
		screen.subscribe(screenValue => { this.screen = screenValue });
		this.rectangleRenderer = rectangleRenderer;
		this.textRenderer = textRenderer;
		this.statsManager = statsManager;
	}

	render(state: SafeState) {
		if (state.ui.statsShowing) {
			const stats = this.statsManager;

			const playersOnline = stats.getPlayersOnline();
			const pingTimeMs = stats.getPingTime().toFixed(0);
			const serverTickMs = stats.getServerTickTime().toFixed(3);
			const serverTicksPerSec = (1000 / stats.getServerTickTime()).toFixed(0);
			const timeBetweenAnimationsMs = stats.getTimeBetweenAnimantions().toFixed(1);
			const animationPerSec = (1000 / stats.getTimeBetweenAnimantions()).toFixed(1);
			const jsRenderTimeMs = stats.getJsRenderTime().toFixed(1);

			const statStrings = [
				`playersOnline: ${playersOnline}`,
				`pingTimeMs: ${pingTimeMs}`,
				`serverTickMs: ${serverTickMs}`,
				`serverTicksPerSec: ${serverTicksPerSec}`,
				`timeBetweenAnimationsMs: ${timeBetweenAnimationsMs}`,
				`animationPerSec: ${animationPerSec}`,
				`jsRenderTimeMs: ${jsRenderTimeMs}`,
			];

			const lineHeight = 20;
			const statsTop = this.screen.bottom - (lineHeight*(statStrings.length+1));

			const statTextData = statStrings.map((statString, index) => {
				const leftTop = new Point(10, statsTop + (lineHeight*index));
				return new CWText(statString, leftTop, FONT_SIZE, rensets.stats.color);
			});

			this.textRenderer.render(statTextData);
		}
	}
}
