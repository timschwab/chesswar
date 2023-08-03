import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
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
	const transposedMap = transpose(map.rect, cameraTL);
	background.fillRect(transposedMap, rensets.grid.background);
}

function backgroundDiff(state: SafeState, prev: Point, cur: Point) {
	const prevCameraTL = cameraTopLeft(state.screen, prev);
	const prevTransposedMap = transpose(map.rect, prevCameraTL);

	const curCameraTL = cameraTopLeft(state.screen, cur);
	const curTransposedMap = transpose(map.rect, curCameraTL);

	const overlap = findOverlap(prevTransposedMap, curTransposedMap);

	overlap.first.left && background.clearRect(overlap.first.left);
	overlap.first.right && background.clearRect(overlap.first.right);
	overlap.first.top && background.clearRect(overlap.first.top);
	overlap.first.bottom && background.clearRect(overlap.first.bottom);

	overlap.second.left && background.fillRect(overlap.second.left, rensets.grid.background);
	overlap.second.right && background.fillRect(overlap.second.right, rensets.grid.background);
	overlap.second.top && background.fillRect(overlap.second.top, rensets.grid.background);
	overlap.second.bottom && background.fillRect(overlap.second.bottom, rensets.grid.background);
}

function transpose(mapRect: Rect, cameraTL: Point) {
	const mapTL = new Point(mapRect.leftTop.x-cameraTL.x, mapRect.leftTop.y-cameraTL.y);
	const mapBR = new Point(mapRect.rightBottom.x-cameraTL.x, mapRect.rightBottom.y-cameraTL.y);
	return new Rect(mapTL, mapBR);
}

// A kinda dumb algo but it works
function findOverlap(first: Rect, second: Rect) {
	const bothLeft = Math.max(first.left, second.left);
	const bothRight = Math.min(first.right, second.right);
	const bothTop = Math.max(first.top, second.top);
	const bothBottom = Math.min(first.bottom, second.bottom);

	// No overlap
	if ((bothLeft > bothRight) || (bothTop > bothBottom)) {
		return {
			first: {
				left: first,
				right: null,
				top: null,
				bottom: null
			},
			second: {
				left: second,
				right: null,
				top: null,
				bottom: null
			},
			both: null
		};
	}

	const bothTL = new Point(bothLeft, bothTop);
	const bothBR = new Point(bothRight, bothBottom);

	const both = new Rect(bothTL, bothBR);

	const firstLeft = first.left < second.left ? new Rect(first.leftTop, new Point(second.left, first.bottom)) : null;
	const firstRight = first.right > second.right ? new Rect(new Point(second.right, first.top), first.rightBottom) : null;
	const firstTop = first.top < second.top ? new Rect(first.leftTop, new Point(first.right, second.top)) : null;
	const firstBottom = first.bottom > second.bottom ? new Rect(new Point(first.left, second.bottom), first.rightBottom) : null;

	const secondLeft = second.left < first.left ? new Rect(second.leftTop, new Point(first.left, second.bottom)) : null;
	const secondRight = second.right > first.right ? new Rect(new Point(first.right, second.top), second.rightBottom) : null;
	const secondTop = second.top < first.top ? new Rect(second.leftTop, new Point(second.right, first.top)) : null;
	const secondBottom = second.bottom > first.bottom ? new Rect(new Point(second.left, first.bottom), second.rightBottom) : null;

	return {
		first: {
			left: firstLeft,
			right: firstRight,
			top: firstTop,
			bottom: firstBottom
		},
		second: {
			left: secondLeft,
			right: secondRight,
			top: secondTop,
			bottom: secondBottom
		},
		both: both
	};
}
