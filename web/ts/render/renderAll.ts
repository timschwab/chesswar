import { PlayerRole } from "../../../common/data-types/base.ts";
import { SafeState } from "../state.ts";
import { renderBackground } from "./renderBackground.ts";
import { renderGrid } from "./renderGrid.ts";
import { renderMap } from "./renderMap.ts";
import { clearRemovedPlayers, renderPlayers } from "./renderPlayers.ts";

export function renderAll(state: SafeState) {
	renderField(state);
	renderUi(state);
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

function renderUi(state: SafeState) {
	//renderRole(state);
	if (state.self.role == PlayerRole.GENERAL) {
		//renderGeneralWindow(state, canvas.UI);
	} else {
		//renderMiniChessboard(state);
	}
	//renderActionOption(state, canvas.UI);

	//renderVictory(state, canvas.UI);

	if (state.stats.show) {
		//renderStats(state, canvas.UI);
	}
}
