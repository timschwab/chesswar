import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { CWCamera } from "../camera.ts";

export function renderBackground(fieldCamera: CWCamera) {
	fieldCamera.clear();

	// Fill in the map background color
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	fieldCamera.fillRect(mapRect, rensets.grid.background);

	// Draw the vertical grid
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		const start = Point(x, 0);
		const finish = Point(x, map.height);
		fieldCamera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}

	// Draw the horizontal grid
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = Point(0, y);
		const finish = Point(map.width, y);
		fieldCamera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}
}
