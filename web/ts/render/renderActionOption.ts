import { rensets } from "../../../common/settings.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { CWCanvas, TextAlign } from "../canvasTypes.ts";
import { SafeState } from "../state.ts";

export function renderActionOption(state: SafeState, uiCanvas: CWCanvas) {
	const actionOption = state.self.actionOption;

	const actionRectWidth = 500;
	const actionTopLeft = Point(state.screen.center.x-(actionRectWidth/2), 10);
	const actionBottomRight = Point(state.screen.center.x+(actionRectWidth/2), 50);
	const actionRect = Rect(actionTopLeft, actionBottomRight);

	uiCanvas.fillRect(actionRect, rensets.actionOption.backgroundColor);
	uiCanvas.outlineRect(actionRect, rensets.actionOption.outlineColor, rensets.actionOption.outlineWidth);
	uiCanvas.text(actionRect, TextAlign.CENTER, "Available action: " + (actionOption || ""), rensets.actionOption.textFont, rensets.actionOption.textColor);
}
