import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { gameRoot } from "../canvas/dom.ts";
import { CWScene } from "./CWScene.ts";

// Create scene
export const scene = new CWScene(gameRoot);

// Background
const background = scene.createLayer(0);
background.addStaticRect(map.shape);

// Vertical grid
const verticalGrid = scene.createLayer(1);
for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
	const start = new Point(x, 0);
	const finish = new Point(x+rensets.grid.width, map.height);
	const shape = {
		geo: new Rect(start, finish),
		color: rensets.grid.color
	};
	verticalGrid.addStaticRect(shape);
}

// Horizontal grid
const horizontalGrid = scene.createLayer(1);
for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
	const start = new Point(0, y);
	const finish = new Point(map.width, y+rensets.grid.width);
	const shape = {
		geo: new Rect(start, finish),
		color: rensets.grid.color
	};
	horizontalGrid.addStaticRect(shape);
}
