import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { transposePoint } from "../../../common/shapes/transpose.ts";
import { Line, Point, Rect } from "../../../common/shapes/types.ts";
import canvas from "../canvas/canvas.ts";
import { Diff } from "../diffStore.ts";
import { SafeState } from "../state.ts";
import { cameraTopLeft } from "./renderUtils.ts";

export function renderGrid(state: SafeState, posDiff: Diff<Point>) {
	if (posDiff.prev == null) {
		newGrid(state, Point(Math.floor(posDiff.cur.x), Math.floor(posDiff.cur.y)));
	} else {
		gridDiff(state, Point(Math.floor(posDiff.prev.x), Math.floor(posDiff.prev.y)), Point(Math.floor(posDiff.cur.x), Math.floor(posDiff.cur.y)));
	}
}

function newGrid(state: SafeState, pos: Point) {
	const rects = getGrid(state, pos);
	drawGrid(rects);
}

function gridDiff(state: SafeState, prev: Point, cur: Point) {
	const prevLines = getGrid(state, prev);
	const curLines = getGrid(state, cur);

	clearGrid(prevLines);
	drawGrid(curLines);
}

function drawGrid(rects: Rect[]) {
	for (const rect of rects) {
		canvas.FIELD_GRID.fillRect(rect, rensets.grid.color);
	}
}

function clearGrid(rects: Rect[]) {
	for (const rect of rects) {
		canvas.FIELD_GRID.clearRect(rect);
	}
}

function getGrid(state: SafeState, pos: Point): Rect[] {
	const cameraTL = cameraTopLeft(state.screen, pos);
	const lines = new Array<Rect>();

	// Vertical lines
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		const start = transposePoint(Point(x, 0), cameraTL);
		const finish = transposePoint(Point(x+rensets.grid.width, map.height), cameraTL);
		lines.push(Rect(start, finish));
	}

	// Horizontal lines
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = transposePoint(Point(0, y), cameraTL);
		const finish = transposePoint(Point(map.width, y+rensets.grid.width), cameraTL);
		lines.push(Rect(start, finish));
	}

	return lines;
}
