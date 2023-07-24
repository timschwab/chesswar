import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { CWCamera } from "../camera.ts";
import { fieldCanvas } from "../canvas.ts";
import { Diff } from "../diffStore.ts";
import { SafeState } from "../state.ts";

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
	fieldCanvas.fillRect(transposedRect, rensets.grid.background);
}

function backgroundDiff(state: SafeState, prev: Point, cur: Point) {
	const prevCameraTL = cameraTopLeft(state.screen, prev);
	const prevTransposedRect = transpose(map.rect, prevCameraTL);

	const curCameraTL = cameraTopLeft(state.screen, cur);
	const curTransposedRect = transpose(map.rect, curCameraTL);

	const overlap = findOverlap(prevTransposedRect, curTransposedRect);

	overlap.first.left && fieldCanvas.clearRect(overlap.first.left);
	overlap.first.right && fieldCanvas.clearRect(overlap.first.right);
	overlap.first.top && fieldCanvas.clearRect(overlap.first.top);
	overlap.first.bottom && fieldCanvas.clearRect(overlap.first.bottom);

	overlap.second.left && fieldCanvas.fillRect(overlap.second.left, rensets.grid.background);
	overlap.second.right && fieldCanvas.fillRect(overlap.second.right, rensets.grid.background);
	overlap.second.top && fieldCanvas.fillRect(overlap.second.top, rensets.grid.background);
	overlap.second.bottom && fieldCanvas.fillRect(overlap.second.bottom, rensets.grid.background);
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



function renderBackgroundOld(fieldCamera: CWCamera) {
	// Fill in the map background color
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	fieldCamera.fillRect(mapRect, rensets.grid.background);

	// Draw the vertical grid
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		const start = Point(x, 0);
		const finish = Point(x, map.height);
		//fieldCamera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}

	// Draw the horizontal grid
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = Point(0, y);
		const finish = Point(map.width, y);
		//fieldCamera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}
}
