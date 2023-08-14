import { SafeState } from "../state.ts";
import { renderBackground } from "./renderBackground.ts";
import { renderGrid } from "./renderGrid.ts";
import { renderMap } from "./renderMap.ts";
import { clearRemovedPlayers, renderPlayers } from "./renderPlayers.ts";

export function renderAll(state: SafeState) {
	renderField(state);
	//renderUi(state);
}

function renderField(state: SafeState) {
	// Clear old players
	clearRemovedPlayers(state);

	for (const diff of state.self.position.diffs()) {
		renderBackground(state, diff);
		renderGrid(state, diff);
		renderMap(state, diff);
		renderPlayers(state, diff);
	}
}

/*
function renderUi(state: SafeState) {
	canvas.UI.clearAll();

	renderRole(state, canvas.UI);
	if (state.self.role == PlayerRole.GENERAL) {
		renderGeneralWindow(state, canvas.UI);
	} else {
		renderMiniChessboard(state);
	}
	renderActionOption(state, canvas.UI);

	renderVictory(state, canvas.UI);

	if (state.stats.show) {
		renderStats(state, canvas.UI);
	}
}

/*
function makeCamera(state: SafeState): CWCamera {
	const width = state.screen.width;
	const height = state.screen.height;
	const center = state.self.position.value()?.center;

	const topLeft = new Point(center.x-width/2, center.y-height/2);
	const bottomRight = new Point(center.x+width/2, center.y+height/2);

	const cameraRect = new Rect(topLeft, bottomRight);

	return new CWCamera(canvas.FIELD, cameraRect);
}
*/
