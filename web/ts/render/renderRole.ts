import { rensets } from "../../../common/settings.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { CWCanvas, TextAlign } from "../canvasTypes.ts";
import { SafeState } from "../state.ts";

export function renderRole(state: SafeState, uiCanvas: CWCanvas) {
	const textRect = Rect(Point(10, 10), Point(200, 30));
	uiCanvas.fillRect(textRect, rensets.currentRole.teamColor[state.self.team]);
	uiCanvas.outlineRect(textRect, rensets.currentRole.outlineColor, rensets.currentRole.outlineWidth);
	uiCanvas.text(textRect, TextAlign.CENTER, "You are a: " + state.self.role, rensets.currentRole.textFont, rensets.currentRole.textColor)
}
