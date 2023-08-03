import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas, TextAlign } from "../canvas/CWCanvas.ts";
import { SafeState } from "../state.ts";

export function renderRole(state: SafeState, uiCanvas: CWCanvas) {
	const textRect = new Rect(new Point(10,10), new Point(200,30));
	uiCanvas.fillRect(textRect, rensets.currentRole.teamColor[state.self.team]);
	uiCanvas.outlineRect(textRect, rensets.currentRole.outlineColor, rensets.currentRole.outlineWidth);
	uiCanvas.text(textRect, TextAlign.CENTER, "You are a: " + state.self.role, rensets.currentRole.textFont, rensets.currentRole.textColor)
}
