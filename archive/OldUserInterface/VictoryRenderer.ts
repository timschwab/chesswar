import { Victory } from "../../../../common/data-types/base.ts";
import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { ZeroPoint, ZeroRect } from "../../../../common/shapes/Zero.ts";
import { bindToScreen } from "../../core/screen.ts";
import { SafeState } from "../../game-logic/state.ts";
import { CWText } from "../../webgl/text/CWText.ts";

const VICTORY_FONT_SIZE = 0.875;
const NEW_GAME_FONT_SIZE = 0.375;

export class VictoryRenderer {
	private readonly glyphBoundingBox;
	private screen: Rect = ZeroRect;

	private victoryText: CWText | null = null;
	private newGameText: CWText | null = null;

	constructor(glyphBoundingBox: Rect) {
		this.glyphBoundingBox = glyphBoundingBox;

		bindToScreen(screenValue => { this.screen = screenValue });
	}

	setState(state: SafeState): void {
		if (state.victory == null) {
			this.victoryText = null;
			this.newGameText = null;
			return;
		}

		// Victory message
		const victoryMessage = this.victoryMessage(state.victory);
		const firstVictoryText = new CWText(victoryMessage, ZeroPoint, VICTORY_FONT_SIZE, rensets.victory.color);
		const victoryBoundingBox = firstVictoryText.getRect(this.glyphBoundingBox);

		const victoryTextLeft = this.screen.center.x-(victoryBoundingBox.width/2);
		const victoryTextTop = this.screen.center.y-(victoryBoundingBox.height/2);
		this.victoryText = new CWText(
			victoryMessage,
			new Point(victoryTextLeft, victoryTextTop),
			VICTORY_FONT_SIZE,
			rensets.victory.color);

		// New game ticks
		const newGameMessage = "New game in: " + state.newGameCounter;
		const firstNewGameText = new CWText(newGameMessage, ZeroPoint, NEW_GAME_FONT_SIZE, rensets.victory.color);
		const newGameBoundingBox = firstNewGameText.getRect(this.glyphBoundingBox);

		const newGameTextLeft = this.screen.center.x-(newGameBoundingBox.width/2);
		const newGameTextTop = this.screen.bottom-(newGameBoundingBox.height);
		this.newGameText = new CWText(
			newGameMessage,
			new Point(newGameTextLeft, newGameTextTop),
			NEW_GAME_FONT_SIZE,
			rensets.victory.color);
	}

	private victoryMessage(victory: Victory): string {
		if (victory == null) {
			return "";
		} else if (victory == "tie") {
			return "It's a tie!";
		} else {
			return "Team " + victory + " wins!";
		}
	}

	getStructures(): Structure[] {
		return [];
	}

	getTextData(): CWText[] {
		if (this.victoryText !== null && this.newGameText !== null) {
			return [this.victoryText, this.newGameText];
		} else {
			return [];
		}
	}
}
