import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { PlayerRole, TeamName } from "../../../common/data-types/base.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas, TextAlign } from "../canvas/CWCanvas.ts";
import { createHtmlCanvas } from "../canvas/dom.ts";

export class CwUserInterface {
	private readonly cwCanvas: CWCanvas;
	private readonly team: Deferred<TeamName | null>;
	private readonly role: Deferred<PlayerRole | null>;

	constructor() {
		const htmlCanvas = createHtmlCanvas(1);
		this.cwCanvas = new CWCanvas(htmlCanvas);
		this.team = new Deferred(null);
		this.role = new Deferred(null);
	}

	setTeam(team: TeamName) {
		this.team.set(team);
	}

	setRole(role: PlayerRole) {
		this.role.set(role);
	}

	render() {
		this.renderTeamRole();
	}

	renderTeamRole() {
		const teamDiff = this.team.get();
		const roleDiff = this.role.get();

		if (teamDiff.pending == null && roleDiff.pending == null) {
			// Do nothing
		} else {
			const newTeam = teamDiff.pending || teamDiff.current;
			const newRole = roleDiff.pending || roleDiff.current;
			if (newTeam != null && newRole != null) {
				this.renderTeamRoleInternal(newTeam, newRole);
			}
		}
	}

	renderTeamRoleInternal(team: TeamName, role: PlayerRole) {
		const textRect = new Rect(new Point(10,10), new Point(200,30));
		this.cwCanvas.fillRect(new Shape(textRect, rensets.currentRole.teamColor[team]));
		this.cwCanvas.outlineRect(new Shape(textRect, rensets.currentRole.outlineColor), rensets.currentRole.outlineWidth);
		this.cwCanvas.text(textRect, TextAlign.CENTER, "You are a: " + role, rensets.currentRole.textFont, rensets.currentRole.textColor);
	}
}
