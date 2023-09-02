import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { TextAlign } from "../canvas/CWCanvas.ts";
import canvas from "../canvas/canvas.ts";
import { SafeState } from "../state.ts";

export function renderRole(state: SafeState) {
	const textRect = new Rect(new Point(10,10), new Point(200,30));
	canvas.UI.fillRect(textRect, rensets.currentRole.teamColor[state.self.team]);
	canvas.UI.outlineRect(textRect, rensets.currentRole.outlineColor, rensets.currentRole.outlineWidth);
	canvas.UI.text(textRect, TextAlign.CENTER, "You are a: " + state.self.role, rensets.currentRole.textFont, rensets.currentRole.textColor)
}
