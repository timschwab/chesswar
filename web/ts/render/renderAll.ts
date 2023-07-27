import { SafeState } from "../state.ts";
import { renderGeneralWindow } from "../generalWindow.ts";
import { PlayerRole } from "../../../common/data-types/base.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { CWCamera } from "../camera.ts";
import { renderBackground } from "./renderBackground.ts";
import { renderMap } from "./renderMap.ts";
import { renderPlayers } from "./renderPlayers.ts";
import { renderRole } from "./renderRole.ts";
import { renderMiniChessboard } from "./renderMiniChessboard.ts";
import { renderActionOption } from "./renderActionOption.ts";
import { renderVictory } from "./renderVictory.ts";
import { renderStats } from "./renderStats.ts";
import canvas from "../canvas.ts";

export function renderAll(state: SafeState) {
	renderField(state);
	//renderUi(state);
}

function renderField(state: SafeState) {
	for (const diff of state.selfPosition.diffs()) {
		renderBackground(state, diff);
	}
	// const fieldCamera = makeCamera(state);
	// state.self.position.center;

	//renderMap(state, fieldCamera);
	//renderPlayers(state, fieldCamera);
}

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

function makeCamera(state: SafeState): CWCamera {
	const width = state.screen.width;
	const height = state.screen.height;
	const center = state.self.position.center;

	const topLeft = Point(center.x - width / 2, center.y - height / 2);
	const bottomRight = Point(
		center.x + width / 2,
		center.y + height / 2
	);

	const cameraRect = Rect(topLeft, bottomRight);

	return new CWCamera(canvas.FIELD, cameraRect);
}
