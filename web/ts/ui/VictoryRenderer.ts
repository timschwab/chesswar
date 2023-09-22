import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { Victory } from "../../../common/data-types/base.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Text, TextAlign } from "../../../common/shapes/Text.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class VictoryRenderer {
	private cwCanvas: CWCanvas;
	private victory: Deferred<Victory>;
	private newGameTicks: Deferred<number>;

	constructor(cwCanvas: CWCanvas) {
		this.cwCanvas = cwCanvas;
		this.victory = new Deferred(null);
		this.newGameTicks = new Deferred(0);
	}

	setVictory(victory: Victory) {
		this.victory.set(victory);
	}

	setNewGameTicks(ticks: number) {
		this.newGameTicks.set(ticks);
	}

	render(screen: Rect) {
		const victoryDiff = this.victory.get();
		const ticksDiff = this.newGameTicks.get();

		if (victoryDiff.dirty) {
			this.renderVictory(screen, victoryDiff.latest);
		}

		if (ticksDiff.dirty && victoryDiff.latest != null) {
			this.renderTicks(screen, ticksDiff.latest);
		}
	}

	forceRender(screen: Rect) {
		const victoryDiff = this.victory.get();
		const ticksDiff = this.newGameTicks.get();

		this.renderVictory(screen, victoryDiff.latest);

		if (victoryDiff.latest != null) {
			this.renderTicks(screen, ticksDiff.latest);
		}
	}

	renderVictory(screen: Rect, victory: Victory) {
		if (victory == null) {
			this.cwCanvas.clearAll();
			return;
		}

		const victoryText = new Text(screen, this.victoryMessage(victory), TextAlign.CENTER, rensets.victory.font, rensets.victory.color);
		this.cwCanvas.text(victoryText);
	}

	renderTicks(screen: Rect, newGameTicks: number) {
		const newGameTicksRectTopLeft = new Point(screen.left, screen.center.y);
		const newGameTicksRect = new Rect(newGameTicksRectTopLeft, screen.rightBottom).shrink(100);
		const newGameTicksText = new Text(newGameTicksRect, "New game in: " + newGameTicks, TextAlign.CENTER, rensets.victory.newGameFont, rensets.victory.newGameColor);

		this.cwCanvas.clearRect(newGameTicksRect);
		this.cwCanvas.text(newGameTicksText);
	}

	victoryMessage(victory: Victory): string {
		if (victory == null) {
			return "";
		} else if (victory == "tie") {
			return "It's a tie!";
		} else {
			return "Team " + victory + " wins!";
		}
	}
}
