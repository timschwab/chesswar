import { Color } from "../../../common/colors.ts";
import { PlayerRole } from "../../../common/data-types/base.ts";
import { rensets } from "../../../common/settings.ts";
import { clampCircleInsideRect } from "../../../common/shapes/clamp.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { CWCamera } from "../camera.ts";
import { TextAlign } from "../canvasTypes.ts";
import { SafeState } from "../state.ts";

export function renderPlayers(state: SafeState, fieldCamera: CWCamera) {
	for (const player of state.playerMap.values()) {
		let color: Color;

		if (player.id == state.selfId) {
			color = rensets.players.self;
		} else {
			color = rensets.players.teamColor[player.team];
		}

		let pos = player.position;
		const isEnemy = player.team != state.self.team;
		const isSoldierOrTank = player.role == PlayerRole.SOLDIER || player.role == PlayerRole.TANK;
		if (state.self.role == PlayerRole.TANK && isEnemy && isSoldierOrTank) {
			pos = clampCircleInsideRect(fieldCamera.getRect(), pos);
		}

		fieldCamera.fillCircle(pos, color);

		if (player.deathCounter > 0) {
			const textRectTopLeft = Point(pos.center.x - pos.radius, pos.center.y - pos.radius);
			const textRectBottomRight = Point(pos.center.x + pos.radius, pos.center.y + pos.radius);
			const textRect = Rect(textRectTopLeft, textRectBottomRight);
			fieldCamera.text(textRect, TextAlign.CENTER, String(player.deathCounter), rensets.players.deathCounter.font, rensets.players.deathCounter.color);
		}

		const nameRect = Rect(Point(pos.center.x, pos.center.y+pos.radius+10), Point(pos.center.x, pos.center.y+pos.radius+10));
		fieldCamera.text(nameRect, TextAlign.CENTER, player.id.slice(0, 4), rensets.players.name.font, rensets.players.name.color);
	}
}
