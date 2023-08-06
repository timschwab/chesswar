import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Circle } from "../../../common/shapes/Circle.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import canvas from "../canvas/canvas.ts";
import { Diff } from "../diffStore.ts";
import { SafeState } from "../state.ts";
import { cameraTopLeft } from "./renderUtils.ts";

export function renderGrid(state: SafeState, posDiff: Diff<Circle>) {
	if (posDiff.prev == null) {
		newGrid(state, posDiff.cur.center);
	} else {
		gridDiff(state, posDiff.prev.center, posDiff.cur.center);
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
		const start = new Point(x, 0).subtract(cameraTL);
		const finish = new Point(x+rensets.grid.width, map.height).subtract(cameraTL);
		lines.push(new Rect(start, finish));
	}

	// Horizontal lines
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = new Point(0, y).subtract(cameraTL);
		const finish = new Point(map.width, y+rensets.grid.width).subtract(cameraTL);
		lines.push(new Rect(start, finish));
	}

	return lines;
}
