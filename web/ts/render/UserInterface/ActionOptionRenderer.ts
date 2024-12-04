import { CWColor } from "../../../../common/Color.ts";
import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { bindToScreen } from "../../core/screen.ts";
import { SafeState } from "../../game-logic/state.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { UiComponentRenderer } from "./UiComponentRenderer.ts";

export class ActionOptionRenderer implements UiComponentRenderer {
	private readonly glyphBoundingBox;
	private screen: Rect | null = null;

	private outerRect: Structure | null = null;
	private innerRect: Structure | null = null;

	private actionText: CWText | null = null;

	constructor(glyphBoundingBox: Rect) {
		this.glyphBoundingBox = glyphBoundingBox;

		bindToScreen(screenValue => { this.screen = screenValue });
	}

	setState(state: SafeState): void {
		if (this.screen === null) {
			return;
		}

		const option = state.selfPlayer.actionOption;

		// I hate all of this. I need to make it easy to align text vertically and horizontally.
		const textMessage = "Available action: " + option;
		const firstText = new CWText(textMessage, new Point(0, 0), 0.25, CWColor.GREY_BLACK);
		const textBoundingBox = firstText.getRect(this.glyphBoundingBox);

		const textTopLeft = new Point(this.screen.center.x-(textBoundingBox.width/2), 10);
		const textBotRght = new Point(this.screen.center.x+(textBoundingBox.width/2), 10+textBoundingBox.height);

		const textRect = new Rect(textTopLeft, textBotRght);
		this.actionText = new CWText(textMessage, textTopLeft, 0.25, CWColor.GREY_BLACK);

		this.outerRect = Shape.from(textRect, rensets.actionOption.backgroundColor).toStructure();
		this.innerRect = Shape.from(textRect.expand(rensets.actionOption.outlineWidth), rensets.actionOption.outlineColor).toStructure();
	}

	getStructures(): Structure[] {
		if (this.outerRect !== null && this.innerRect !== null) {
			return [this.outerRect, this.innerRect];
		} else {
			return [];
		}
	}

	getTextData(): CWText[] {
		if (this.actionText !== null) {
			return [this.actionText];
		} else {
			return [];
		}
	}
}
