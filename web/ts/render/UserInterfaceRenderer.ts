import { CWColor } from "../../../common/Color.ts";
import { PlayerRole, TeamName } from "../../../common/data-types/base.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { bindToScreen } from "../core/screen.ts";
import { StructureRenderer } from "../webgl/structure/StructureRenderer.ts";
import { CWText } from "../webgl/text/CWText.ts";
import { TextRenderer } from "../webgl/text/TextRenderer.ts";

export class UserInterfaceRenderer {
	private readonly textRenderer;
	private readonly structureRenderer;

	constructor() {
		// Create from back to front
		this.structureRenderer = new StructureRenderer();
		this.textRenderer = new TextRenderer();

		// Bind the camera to the center of the screen
		bindToScreen(screenValue => {
			this.structureRenderer.setCamera(screenValue.center);
			this.textRenderer.setCamera(screenValue.center);
		});
	}

	setState(team: TeamName, role: PlayerRole): void {
		const textRect = new Rect(new Point(10,10), new Point(200,30));
		const roleText = new CWText("You are a: " + role, textRect.leftTop, 0.125, CWColor.GREY_BLACK);

		const inner = Shape.from(textRect, rensets.players.teamColor[team]).toStructure();
		const outer = Shape.from(textRect.expand(rensets.currentRole.outlineWidth), rensets.currentRole.outlineColor).toStructure();

		this.structureRenderer.setStructures([outer, inner]);
		this.textRenderer.setTextData([roleText]);
	}

	render(): void {
		this.structureRenderer.render();
		this.textRenderer.render();
	}
}
