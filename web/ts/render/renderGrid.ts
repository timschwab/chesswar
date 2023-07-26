import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { CWCamera } from "../camera.ts";
import { Diff } from "../diffStore.ts";
import { SafeState } from "../state.ts";

export function renderGrid(state: SafeState, posDiff: Diff<Point>) {
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
