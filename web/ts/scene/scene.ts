import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Circle } from "../../../common/shapes/Circle.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { gameRoot } from "../canvas/dom.ts";
import { CWScene } from "./CWScene.ts";

// Create scene
export const scene = new CWScene(gameRoot);

// Background
const background = scene.createLayer();
background.addStaticRect(map.shape);

// Vertical grid
const verticalGrid = scene.createLayer();
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
const horizontalGrid = scene.createLayer();
for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
	const start = new Point(0, y);
	const finish = new Point(map.width, y+rensets.grid.width);
	const shape = {
		geo: new Rect(start, finish),
		color: rensets.grid.color
	};
	horizontalGrid.addStaticRect(shape);
}

// Map external areas
const externalMap = scene.createLayer();
externalMap.addStaticCircle({
	geo: map.safeZone, color: rensets.center.safe
});

for (const bundle of map.facilities) {
	externalMap.addStaticRect({
		geo: bundle.base,
		color: rensets.facilities.ally.base
	});

	for (const outpost of bundle.outposts) {
		externalMap.addStaticRect({
			geo: outpost, color: rensets.facilities.ally.outpost
		});
	}
}

// Map internal areas
const internalMap = scene.createLayer();
internalMap.addStaticCircle({
	geo: map.battlefield, color: rensets.center.battlefield
});

for (const bundle of map.facilities) {
	internalMap.addStaticRect({
		geo: bundle.command, color: rensets.facilities.ally.command
	});

	for (const briefing of bundle.briefings) {
		internalMap.addStaticRect({
			geo: briefing, color: rensets.facilities.ally.pickup
		});
	}

	internalMap.addStaticRect({
		geo: bundle.armory, color: rensets.facilities.ally.armory
	});

	internalMap.addStaticRect({
		geo: bundle.scif, color: rensets.facilities.ally.scif
	});
}

// Minefields
const minefields = scene.createLayer();
for (const minefield of map.minefields) {
	if (Rect.isRect(minefield)) {
		minefields.addStaticRect({
			geo: minefield, color: rensets.minefield.color
		});
	} else if (Circle.isCircle(minefield)) {
		minefields.addStaticCircle({
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
	const verticalBoundaries = scene.createLayer();
	verticalBoundaries.addStaticRect({
		geo: overlaps.first.left, color: rensets.mapBorder.color
	});
	verticalBoundaries.addStaticRect({
		geo: overlaps.first.right, color: rensets.mapBorder.color
	});

	const horizontalBoundaries = scene.createLayer();
	horizontalBoundaries.addStaticRect({
		geo: overlaps.first.top, color: rensets.mapBorder.color
	});
	horizontalBoundaries.addStaticRect({
		geo: overlaps.first.bottom, color: rensets.mapBorder.color
	});
}
