import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import canvas from "../canvas/canvas.ts";
import { Diff } from "../diffStore.ts";
import { SafeState } from "../state.ts";

const background = canvas.FIELD_BACKGROUND;

export function renderBackground(state: SafeState, posDiff: Diff<Point>) {
	if (posDiff.prev == null) {
		newBackground(state, Point(Math.floor(posDiff.cur.x), Math.floor(posDiff.cur.y)));
	} else {
		backgroundDiff(state, Point(Math.floor(posDiff.prev.x), Math.floor(posDiff.prev.y)), Point(Math.floor(posDiff.cur.x), Math.floor(posDiff.cur.y)));
	}
}

function newBackground(state: SafeState, pos: Point) {
	const cameraTL = cameraTopLeft(state.screen, pos);
	const transposedRect = transpose(map.rect, cameraTL);
	background.fillRect(transposedRect, rensets.grid.background);
}

function backgroundDiff(state: SafeState, prev: Point, cur: Point) {
	const prevCameraTL = cameraTopLeft(state.screen, prev);
	const prevTransposedRect = transpose(map.rect, prevCameraTL);

	const curCameraTL = cameraTopLeft(state.screen, cur);
	const curTransposedRect = transpose(map.rect, curCameraTL);

	const overlap = findOverlap(prevTransposedRect, curTransposedRect);

	overlap.first.left && background.clearRect(overlap.first.left);
	overlap.first.right && background.clearRect(overlap.first.right);
	overlap.first.top && background.clearRect(overlap.first.top);
	overlap.first.bottom && background.clearRect(overlap.first.bottom);

	overlap.second.left && background.fillRect(overlap.second.left, rensets.grid.background);
	overlap.second.right && background.fillRect(overlap.second.right, rensets.grid.background);
	overlap.second.top && background.fillRect(overlap.second.top, rensets.grid.background);
	overlap.second.bottom && background.fillRect(overlap.second.bottom, rensets.grid.background);
}

// Find where on the map the top left of the camera hits
function cameraTopLeft(screen: Rect, pos: Point) {
	return Point(Math.floor(pos.x - screen.width / 2), Math.floor(pos.y - screen.height / 2));
}

function transpose(mapRect: Rect, cameraTL: Point) {
	const mapTL = Point(mapRect.topLeft.x-cameraTL.x, mapRect.topLeft.y-cameraTL.y);
	const mapBR = Point(mapRect.bottomRight.x-cameraTL.x, mapRect.bottomRight.y-cameraTL.y);
	return Rect(mapTL, mapBR);
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

	const bothTL = Point(bothLeft, bothTop);
	const bothBR = Point(bothRight, bothBottom);

	const both = Rect(bothTL, bothBR);

	const firstLeft = first.left < second.left ? Rect(first.topLeft, Point(second.left, first.bottom)) : null;
	const firstRight = first.right > second.right ? Rect(Point(second.right, first.top), first.bottomRight) : null;
	const firstTop = first.top < second.top ? Rect(first.topLeft, Point(first.right, second.top)) : null;
	const firstBottom = first.bottom > second.bottom ? Rect(Point(first.left, second.bottom), first.bottomRight) : null;

	const secondLeft = second.left < first.left ? Rect(second.topLeft, Point(first.left, second.bottom)) : null;
	const secondRight = second.right > first.right ? Rect(Point(first.right, second.top), second.bottomRight) : null;
	const secondTop = second.top < first.top ? Rect(second.topLeft, Point(second.right, first.top)) : null;
	const secondBottom = second.bottom > first.bottom ? Rect(Point(second.left, first.bottom), second.bottomRight) : null;

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
