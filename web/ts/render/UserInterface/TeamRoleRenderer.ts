import { CWColor } from "../../../../common/Color.ts";
import { TeamName } from "../../../../common/data-types/base.ts";
import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { TextRenderer } from "../../webgl/text/TextRenderer.ts";

const FONT_SIZE = 0.25;

export class TeamRoleRenderer {
	private readonly rectangleRenderer: RectangleRenderer;
	private readonly textRenderer: TextRenderer;

	constructor(rectangleRenderer: RectangleRenderer, textRenderer: TextRenderer) {
		this.rectangleRenderer = rectangleRenderer;
		this.textRenderer = textRenderer;
	}

	render(team: TeamName, role: string) {
		// Draw rectangles
		const teamColor = rensets.players.teamColor[team];
		const innerRect = new Rect(new Point(10, 10), new Point(210, 50));
		const outerRect = innerRect.expand(rensets.currentRole.outlineWidth);
		const shapes = [
			Shape.from(outerRect, rensets.currentRole.outlineColor),
			Shape.from(innerRect, teamColor)
		];
		this.rectangleRenderer.render(shapes);

		// Draw text
		const text = new CWText(role, new Point(15, 15), FONT_SIZE, CWColor.GREY_BLACK);
		this.textRenderer.render([text]);
	}
}
