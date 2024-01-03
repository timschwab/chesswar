import map from "../../common/map.ts";
import { rensets } from "../../common/settings.ts";
import { Point } from "../../common/shapes/Point.ts";
import { Rect } from "../../common/shapes/Rect.ts";
import { Shape } from "../../common/shapes/Shape.ts";
import { Triangle } from "../../common/shapes/Triangle.ts";

function getBackground(): Triangle[] {
	return map.shape.toTriangles();
}

function getGrid(): Triangle[] {
	const triangles: Triangle[] = [];

	// Vertical grid
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		const start = new Point(x, 0);
		const finish = new Point(x+rensets.grid.width, map.height);
		const shape = Shape.from(new Rect(start, finish), rensets.grid.color);
		triangles.push(...shape.toTriangles());
	}
	
	// Horizontal grid
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = new Point(0, y);
		const finish = new Point(map.width, y+rensets.grid.width);
		const shape = Shape.from(new Rect(start, finish), rensets.grid.color);
		triangles.push(...shape.toTriangles());
	}

	return triangles;
}

function getFacilities(): Triangle[] {
	const triangles: Triangle[] = [];

	// Map external areas
	triangles.push(...Shape.from(map.safeZone, rensets.center.safe).toTriangles());
	
	for (const bundle of map.facilities) {
		triangles.push(...Shape.from(bundle.base, rensets.facilities.ally.base).toTriangles());
	
		for (const outpost of bundle.outposts) {
			triangles.push(...Shape.from(outpost, rensets.facilities.ally.outpost).toTriangles());
		}
	}
	
	// Map internal areas
	triangles.push(...Shape.from(map.battlefield, rensets.center.battlefield).toTriangles());
	
	for (const bundle of map.facilities) {
		triangles.push(...Shape.from(bundle.command, rensets.facilities.ally.command).toTriangles());
	
		for (const briefing of bundle.briefings) {
			triangles.push(...Shape.from(briefing, rensets.facilities.ally.pickup).toTriangles());
		}
	
		triangles.push(...Shape.from(bundle.armory, rensets.facilities.ally.armory).toTriangles());
		triangles.push(...Shape.from(bundle.scif, rensets.facilities.ally.scif).toTriangles());
	}

	return triangles;
}

function getMinefields(): Triangle[] {
	return map.minefields.flatMap(mine => Shape.from(mine, rensets.minefield.color).toTriangles());
}

function getBorder(): Triangle[] {
	const outer = map.shape.geo.expand(rensets.mapBorder.width/2);
	const inner = map.shape.geo.shrink(rensets.mapBorder.width/2);
	const overlaps = outer.overlap(inner);
	
	if (overlaps.first.left && overlaps.first.right && overlaps.first.top && overlaps.first.bottom) {
		const left = Shape.from(overlaps.first.left, rensets.mapBorder.color);
		const right = Shape.from(overlaps.first.right, rensets.mapBorder.color);
	
		const top = Shape.from(overlaps.first.top, rensets.mapBorder.color);
		const bottom = Shape.from(overlaps.first.bottom, rensets.mapBorder.color);

		return [
			...left.toTriangles(),
			...right.toTriangles(),
			...top.toTriangles(),
			...bottom.toTriangles()
		];
	} else {
		return [];
	}

}

export const mapTriangles = [
	...getBackground(),
	...getGrid(),
	...getFacilities(),
	...getMinefields(),
	...getBorder()
];