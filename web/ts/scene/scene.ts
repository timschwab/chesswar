import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Circle } from "../../../common/shapes/Circle.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWScene } from "./CWScene.ts";

// Create scene
export const scene = new CWScene();

// Background
const background = scene.staticLayer();
background.addRect(map.shape);

// Vertical grid
const verticalGrid = scene.staticLayer();
for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
	const start = new Point(x, 0);
	const finish = new Point(x+rensets.grid.width, map.height);
	const shape = {
		geo: new Rect(start, finish),
		color: rensets.grid.color
	};
	verticalGrid.addRect(shape);
}

// Horizontal grid
const horizontalGrid = scene.staticLayer();
for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
	const start = new Point(0, y);
	const finish = new Point(map.width, y+rensets.grid.width);
	const shape = {
		geo: new Rect(start, finish),
		color: rensets.grid.color
	};
	horizontalGrid.addRect(shape);
}

// Map external areas
const externalMap = scene.staticLayer();
externalMap.addCircle({
	geo: map.safeZone, color: rensets.center.safe
});

for (const bundle of map.facilities) {
	externalMap.addRect({
		geo: bundle.base,
		color: rensets.facilities.ally.base
	});

	for (const outpost of bundle.outposts) {
		externalMap.addRect({
			geo: outpost, color: rensets.facilities.ally.outpost
		});
	}
}

// Map internal areas
const internalMap = scene.staticLayer();
internalMap.addCircle({
	geo: map.battlefield, color: rensets.center.battlefield
});

for (const bundle of map.facilities) {
	internalMap.addRect({
		geo: bundle.command, color: rensets.facilities.ally.command
	});

	for (const briefing of bundle.briefings) {
		internalMap.addRect({
			geo: briefing, color: rensets.facilities.ally.pickup
		});
	}

	internalMap.addRect({
		geo: bundle.armory, color: rensets.facilities.ally.armory
	});

	internalMap.addRect({
		geo: bundle.scif, color: rensets.facilities.ally.scif
	});
}

// Minefields
const minefields = scene.staticLayer();
for (const minefield of map.minefields) {
	if (Rect.isRect(minefield)) {
		minefields.addRect({
			geo: minefield, color: rensets.minefield.color
		});
	} else if (Circle.isCircle(minefield)) {
		minefields.addCircle({
			geo: minefield, color: rensets.minefield.color
		});
	} else {
		// Can't get here
	}
}

// Map boundaries
const outer = map.shape.geo.expand(rensets.mapBorder.width/2);
const inner = map.shape.geo.shrink(rensets.mapBorder.width/2);
const overlaps = outer.overlap(inner);

if (overlaps.first.left && overlaps.first.right && overlaps.first.top && overlaps.first.bottom) {
	const verticalBoundaries = scene.staticLayer();
	verticalBoundaries.addRect({
		geo: overlaps.first.left, color: rensets.mapBorder.color
	});
	verticalBoundaries.addRect({
		geo: overlaps.first.right, color: rensets.mapBorder.color
	});

	const horizontalBoundaries = scene.staticLayer();
	horizontalBoundaries.addRect({
		geo: overlaps.first.top, color: rensets.mapBorder.color
	});
	horizontalBoundaries.addRect({
		geo: overlaps.first.bottom, color: rensets.mapBorder.color
	});
}

// Players
export const playerLayer = scene.dynamicLayer();
