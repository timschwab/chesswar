import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Circle } from "../../../common/shapes/Circle.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWScene } from "./CWScene.ts";

// Create scene
export const scene = new CWScene();
addBackground();
addGrid();
addMap();
addMinefields();
addBoundaries();

export const playerLayer = scene.dynamicLayer();

// Functions

function addBackground() {
	const background = scene.staticLayer();
	background.addRect(map.shape);
}

function addGrid() {
	// Vertical grid
	const verticalGrid = scene.staticLayer();
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		const start = new Point(x, 0);
		const finish = new Point(x+rensets.grid.width, map.height);
		const shape = Shape.from(new Rect(start, finish), rensets.grid.color);
		verticalGrid.addRect(shape);
	}
	
	// Horizontal grid
	const horizontalGrid = scene.staticLayer();
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = new Point(0, y);
		const finish = new Point(map.width, y+rensets.grid.width);
		const shape = Shape.from(new Rect(start, finish), rensets.grid.color);
		horizontalGrid.addRect(shape);
	}
}

function addMap() {
	// Map external areas
	const externalMap = scene.staticLayer();
	externalMap.addCircle(Shape.from(map.safeZone, rensets.center.safe));
	
	for (const bundle of map.facilities) {
		externalMap.addRect(Shape.from(bundle.base, rensets.facilities.ally.base));
	
		for (const outpost of bundle.outposts) {
			externalMap.addRect(Shape.from(outpost, rensets.facilities.ally.outpost));
		}
	}
	
	// Map internal areas
	const internalMap = scene.staticLayer();
	internalMap.addCircle(Shape.from(map.battlefield, rensets.center.battlefield));
	
	for (const bundle of map.facilities) {
		internalMap.addRect(Shape.from(bundle.command, rensets.facilities.ally.command));
	
		for (const briefing of bundle.briefings) {
			internalMap.addRect(Shape.from(briefing, rensets.facilities.ally.pickup));
		}
	
		internalMap.addRect(Shape.from(bundle.armory, rensets.facilities.ally.armory));
		internalMap.addRect(Shape.from(bundle.scif, rensets.facilities.ally.scif));
	}
}

function addMinefields() {
	const minefields = scene.staticLayer();
	for (const minefield of map.minefields) {
		if (minefield instanceof Rect) {
			minefields.addRect(Shape.from(minefield, rensets.minefield.color));
		} else if (minefield instanceof Circle) {
			minefields.addCircle(Shape.from(minefield, rensets.minefield.color));
		} else {
			// Can't get here
		}
	}
}

function addBoundaries() {
	const outer = map.shape.geo.expand(rensets.mapBorder.width/2);
	const inner = map.shape.geo.shrink(rensets.mapBorder.width/2);
	const overlaps = outer.overlap(inner);
	
	if (overlaps.first.left && overlaps.first.right && overlaps.first.top && overlaps.first.bottom) {
		const verticalBoundaries = scene.staticLayer();
		verticalBoundaries.addRect(Shape.from(overlaps.first.left, rensets.mapBorder.color));
		verticalBoundaries.addRect(Shape.from(overlaps.first.right, rensets.mapBorder.color));
	
		const horizontalBoundaries = scene.staticLayer();
		horizontalBoundaries.addRect(Shape.from(overlaps.first.top, rensets.mapBorder.color));
		horizontalBoundaries.addRect(Shape.from(overlaps.first.bottom, rensets.mapBorder.color));
	}
}
