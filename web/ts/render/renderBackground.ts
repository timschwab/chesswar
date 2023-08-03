import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import canvas from "../canvas/canvas.ts";
import { Diff } from "../diffStore.ts";
import { SafeState } from "../state.ts";
import { cameraTopLeft } from "./renderUtils.ts";

const background = canvas.FIELD_BACKGROUND;

export function renderBackground(state: SafeState, posDiff: Diff<Point>) {
	if (posDiff.prev == null) {
		newBackground(state, new Point(Math.floor(posDiff.cur.x), Math.floor(posDiff.cur.y)));
	} else {
		backgroundDiff(state, new Point(Math.floor(posDiff.prev.x), Math.floor(posDiff.prev.y)), new Point(Math.floor(posDiff.cur.x), Math.floor(posDiff.cur.y)));
	}
}

function newBackground(state: SafeState, pos: Point) {
	const cameraTL = cameraTopLeft(state.screen, pos);
	const transposedMap = map.rect.subtract(cameraTL);
	background.fillRect(transposedMap, rensets.grid.background);
}

function backgroundDiff(state: SafeState, prev: Point, cur: Point) {
	const prevCameraTL = cameraTopLeft(state.screen, prev);
	const prevTransposedMap = map.rect.subtract(prevCameraTL);

	const curCameraTL = cameraTopLeft(state.screen, cur);
	const curTransposedMap = map.rect.subtract(curCameraTL);

	const overlap = prevTransposedMap.overlap(curTransposedMap);

	overlap.first.left && background.clearRect(overlap.first.left);
	overlap.first.right && background.clearRect(overlap.first.right);
	overlap.first.top && background.clearRect(overlap.first.top);
	overlap.first.bottom && background.clearRect(overlap.first.bottom);

	overlap.second.left && background.fillRect(overlap.second.left, rensets.grid.background);
	overlap.second.right && background.fillRect(overlap.second.right, rensets.grid.background);
	overlap.second.top && background.fillRect(overlap.second.top, rensets.grid.background);
	overlap.second.bottom && background.fillRect(overlap.second.bottom, rensets.grid.background);
}
