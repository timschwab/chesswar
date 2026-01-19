import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { ZeroRect } from "../../../../common/shapes/Zero.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { GameStats } from "../../game-logic/GameStats.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { TextRenderer } from "../../webgl/text/TextRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";

const FONT_SIZE = 0.125;

export class StatsRenderer implements UiComponentRenderer {
	private screen: Rect = ZeroRect;
	private readonly textRenderer: TextRenderer;
	private readonly statsManager: GameStats;

	constructor(textRenderer: TextRenderer, screen: CWScreen, statsManager: GameStats) {
		screen.subscribe(screenValue => { this.screen = screenValue });
		this.textRenderer = textRenderer;
		this.statsManager = statsManager;
	}

	render(state: ChesswarState) {
		if (!state.getStatsShowing()) {
			return;
		}

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
