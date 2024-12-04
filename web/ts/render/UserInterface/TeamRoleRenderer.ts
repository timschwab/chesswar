import { CWColor } from "../../../../common/Color.ts";
import { TeamName, PlayerRole } from "../../../../common/data-types/base.ts";
import { rensets } from "../../../../common/settings.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { CWText } from "../../webgl/text/CWText.ts";

export class TeamRoleRenderer {
	private readonly glyphBoundingBox;

	private outerRect: Structure | null = null;
	private innerRect: Structure | null = null;

	private roleText: CWText | null = null;

	constructor(glyphBoundingBox: Rect) {
		this.glyphBoundingBox = glyphBoundingBox;
	}

	setData(role: PlayerRole, team: TeamName) {
		this.roleText = new CWText("You are a: " + role, new Point(10,10), 0.125, CWColor.GREY_BLACK);
		const textRect = this.roleText.getRect(this.glyphBoundingBox).expand(2);

		const teamColor = rensets.players.teamColor[team];
		this.innerRect = Shape.from(textRect, teamColor).toStructure();
		this.outerRect = Shape.from(textRect.expand(rensets.currentRole.outlineWidth), rensets.currentRole.outlineColor).toStructure();
	}

	getStructures(): Structure[] {
		if (this.outerRect !== null && this.innerRect !== null) {
			return [this.outerRect, this.innerRect];
		} else {
			return [];
		}
	}

	getTextData(): CWText[] {
		if (this.roleText !== null) {
			return [this.roleText];
		} else {
			return [];
		}
	}
}
