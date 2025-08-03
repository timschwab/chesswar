import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { SafeState } from "../../game-logic/state.ts";
import { RectangleRenderer } from "../../webgl/rectangle/RectangleRenderer.ts";


export class TeamRoleRenderer {
	private readonly rectangleRenderer: RectangleRenderer;

	constructor(rectangleRenderer: RectangleRenderer) {
		this.rectangleRenderer = rectangleRenderer;
	}

	render(state: SafeState) {
		const team = state.selfPlayer.team;
		const teamColor = rensets.players.teamColor[team];
		const innerRect = new Rect(new Point(10, 10), new Point(210, 50));
		const outerRect = innerRect.expand(rensets.currentRole.outlineWidth);
		const shapes = [
			Shape.from(outerRect, rensets.currentRole.outlineColor),
			Shape.from(innerRect, teamColor)
		];
		this.rectangleRenderer.render(shapes);

		// TODO: Render the text as well
	}
}
