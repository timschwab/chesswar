import { CWColor } from "../../../../common/Color.ts";
import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { ChesswarState } from "../../game-logic/ChesswarState.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { TextRenderer } from "../../webgl/text/TextRenderer.ts";
import { UiComponentRenderer } from "../UiComponentRenderer.ts";

const FONT_SIZE = 0.25;

export class TeamRoleRenderer implements UiComponentRenderer {
	private readonly rectangleRenderer: RectangleRenderer;
	private readonly textRenderer: TextRenderer;

	constructor(rectangleRenderer: RectangleRenderer, textRenderer: TextRenderer) {
		this.rectangleRenderer = rectangleRenderer;
		this.textRenderer = textRenderer;
	}

	render(state: ChesswarState) {
		state.getSelfPlayer().ifPresent(selfPlayer => {
			// Draw rectangles
			const teamColor = rensets.players.teamColor[selfPlayer.team];
			const innerRect = new Rect(new Point(10, 10), new Point(210, 50));
			const outerRect = innerRect.expand(rensets.currentRole.outlineWidth);
			const shapes = [
				Shape.from(outerRect, rensets.currentRole.outlineColor),
				Shape.from(innerRect, teamColor)
			];
			this.rectangleRenderer.render(shapes);
			
			// Draw text
			const text = new CWText(selfPlayer.role, new Point(15, 15), FONT_SIZE, CWColor.GREY_BLACK);
			this.textRenderer.render([text]);
		});
	}
}
