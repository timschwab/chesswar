import { TeamName } from "../../../common/data-types/base.ts";
import { rensets } from "../../../common/settings.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { CWCanvas, TextAlign } from "../canvas/CWCanvas.ts";
import { SafeState } from "../state.ts";

export function renderVictory(state: SafeState, uiCanvas: CWCanvas) {
	if (state.victory == null) {
		return;
	}
	
	if (state.victory == "tie") {
		uiCanvas.text(state.screen, TextAlign.CENTER, "It's a tie!", rensets.victory.font, rensets.victory.color);
	} else if (state.victory == TeamName.BLUE) {
		uiCanvas.text(state.screen, TextAlign.CENTER, "Blue team wins!", rensets.victory.font, rensets.victory.color);
	} else if (state.victory == TeamName.RED) {
		uiCanvas.text(state.screen, TextAlign.CENTER, "Red team wins!", rensets.victory.font, rensets.victory.color);
	}

	const newGameTicksRectTopLeft = Point(state.screen.topLeft.x, state.screen.bottomRight.y/2);
	const newGameTicksRect = Rect(newGameTicksRectTopLeft, state.screen.bottomRight);
	uiCanvas.text(newGameTicksRect, TextAlign.CENTER, "New game in: " + state.newGameCounter, rensets.victory.newGameFont, rensets.victory.newGameColor);
}
