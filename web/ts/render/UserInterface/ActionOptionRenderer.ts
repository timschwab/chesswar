import { CWColor } from "../../../../common/Color.ts";
import { PlayerAction } from "../../../../common/data-types/base.ts";
import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { TextRenderer } from "../../webgl/text/TextRenderer.ts";

const FONT_SIZE = 0.25;

export class ActionOptionRenderer {
	private readonly rectangleRenderer: RectangleRenderer;
	private readonly textRenderer: TextRenderer;

	constructor(rectangleRenderer: RectangleRenderer, textRenderer: TextRenderer) {
		this.rectangleRenderer = rectangleRenderer;
		this.textRenderer = textRenderer;
	}

	render(actionOption: PlayerAction) {
		const textMessage = "Available action: " + actionOption;
		const textRect = new Rect(new Point(230, 10), new Point(900, 50));
		const actionText = new CWText(textMessage, textRect.leftTop.add(new Point(5, 5)), FONT_SIZE, CWColor.GREY_BLACK);
		const innerRect = Shape.from(textRect, rensets.actionOption.backgroundColor);
		const outerRect = Shape.from(textRect.expand(rensets.actionOption.outlineWidth), rensets.actionOption.outlineColor);

		this.rectangleRenderer.render([outerRect, innerRect]);
		this.textRenderer.render([actionText]);
	}
}
