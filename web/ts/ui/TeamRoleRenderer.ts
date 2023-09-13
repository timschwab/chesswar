import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { PlayerRole, TeamName } from "../../../common/data-types/base.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas, TextAlign } from "../canvas/CWCanvas.ts";

export class TeamRoleRenderer {
	private team: Deferred<TeamName | null>;
	private role: Deferred<PlayerRole | null>;

	constructor() {
		this.team = new Deferred(null);
		this.role = new Deferred(null);
	}

	setTeam(team: TeamName) {
		this.team.set(team);
	}

	setRole(role: PlayerRole) {
		this.role.set(role);
	}

	render(cwCanvas: CWCanvas, _screen: Rect) {
		const teamDiff = this.team.get();
		const roleDiff = this.role.get();

		if (teamDiff.pending == null && roleDiff.pending == null) {
			// Do nothing
		} else {
			const newTeam = teamDiff.pending || teamDiff.current;
			const newRole = roleDiff.pending || roleDiff.current;
			if (newTeam != null && newRole != null) {
				this.renderInternal(cwCanvas, newTeam, newRole);
			}
		}
	}

	forceRender(cwCanvas: CWCanvas, _screen: Rect) {
		const teamDiff = this.team.get();
		const roleDiff = this.role.get();

		const coalescedTeam = teamDiff.pending || teamDiff.current;
		const coalescedRole = roleDiff.pending || roleDiff.current;
		if (coalescedTeam != null && coalescedRole != null) {
			this.renderInternal(cwCanvas, coalescedTeam, coalescedRole);
		}
	}

	renderInternal(cwCanvas: CWCanvas, team: TeamName, role: PlayerRole) {
		const textRect = new Rect(new Point(10,10), new Point(200,30));
		cwCanvas.fillRect(new Shape(textRect, rensets.currentRole.teamColor[team]));
		cwCanvas.outlineRect(new Shape(textRect, rensets.currentRole.outlineColor), rensets.currentRole.outlineWidth);
		cwCanvas.text(textRect, TextAlign.CENTER, "You are a: " + role, rensets.currentRole.textFont, rensets.currentRole.textColor);
	}
}
