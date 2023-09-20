import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { PlayerRole, TeamName } from "../../../common/data-types/base.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { Text, TextAlign } from "../../../common/shapes/Text.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class TeamRoleRenderer {
	private cwCanvas: CWCanvas;
	private team: Deferred<TeamName | null>;
	private role: Deferred<PlayerRole>;

	constructor(cwCanvas: CWCanvas) {
		this.cwCanvas = cwCanvas;
		this.team = new Deferred(null);
		this.role = new Deferred(PlayerRole.SOLDIER);
	}

	setTeam(team: TeamName) {
		this.team.set(team);
	}

	setRole(role: PlayerRole) {
		this.role.set(role);
	}

	render(_screen: Rect) {
		const teamDiff = this.team.get();
		const roleDiff = this.role.get();

		if (teamDiff.dirty || roleDiff.dirty) {
			this.renderInternal(teamDiff.latest, roleDiff.latest);
		}
	}

	forceRender(_screen: Rect) {
		const teamDiff = this.team.get();
		const roleDiff = this.role.get();

		this.renderInternal(teamDiff.latest, roleDiff.latest);
	}

	renderInternal(team: TeamName | null, role: PlayerRole) {
		if (team == null) {
			return;
		}

		const textRect = new Rect(new Point(10,10), new Point(200,30));
		const roleText = new Text(textRect, "You are a: " + role, TextAlign.CENTER, rensets.currentRole.textFont, rensets.currentRole.textColor);
		this.cwCanvas.fillRect(new Shape(textRect, rensets.currentRole.teamColor[team]));
		this.cwCanvas.outlineRect(new Shape(textRect, rensets.currentRole.outlineColor), rensets.currentRole.outlineWidth);
		this.cwCanvas.text(roleText);
	}
}
