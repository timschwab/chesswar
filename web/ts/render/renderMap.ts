import { Color } from "../../../common/colors.ts";
import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { Circle } from "../../../common/shapes/Circle.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import canvas from "../canvas/canvas.ts";
import { Diff } from "../diffStore.ts";
import { SafeState } from "../state.ts";
import { cameraTopLeft } from "./renderUtils.ts";

export function renderMap(state: SafeState, posDiff: Diff<Circle>) {
	if (posDiff.prev == null) {
		newMap(state, posDiff.cur.center);
	} else {
		mapDiff(state, posDiff.prev.center, posDiff.cur.center);
	}
}

function newMap(state: SafeState, pos: Point) {
	const cameraTL = cameraTopLeft(state.screen, pos);
	const shapes = getMapShapes(state);

	for (const [rect, color] of shapes.rects) {
		canvas.FIELD_MAP.fillRect(rect.subtract(cameraTL), color);
	}

	for (const [circle, color] of shapes.circles) {
		canvas.FIELD_MAP.fillCircle(circle.subtract(cameraTL), color);
	}
}

function mapDiff(state: SafeState, prev: Point, cur: Point) {
	const prevCameraTL = cameraTopLeft(state.screen, prev);
	const curCameraTL = cameraTopLeft(state.screen, cur);
	const shapes = getMapShapes(state);

	for (const [rect, _color] of shapes.rects) {
		canvas.FIELD_MAP.clearRect(rect.subtract(prevCameraTL));
	}

	for (const [circle, _color] of shapes.circles) {
		canvas.FIELD_MAP.clearRect(circle.subtract(prevCameraTL).enclosingRect());
	}

	for (const [rect, color] of shapes.rects) {
		canvas.FIELD_MAP.fillRect(rect.subtract(curCameraTL), color);
	}

	for (const [circle, color] of shapes.circles) {
		canvas.FIELD_MAP.fillCircle(circle.subtract(curCameraTL), color);
	}
}

function getMapShapes(state: SafeState) {
	const rects = new Array<[Rect, Color]>();
	const circles = new Array<[Circle, Color]>();

	// Draw facilities
	const allyFacilityBundles = map.facilities.filter(fac => fac.team == state.self.team);
	const enemyFacilityBundles = map.facilities.filter(fac => fac.team != state.self.team);

	for (const bundle of allyFacilityBundles) {
		rects.push([bundle.base, rensets.facilities.ally.base]);
		rects.push([bundle.command, rensets.facilities.ally.command]);
		for (const briefing of bundle.briefings) {
			rects.push([briefing, rensets.facilities.ally.pickup]);
		}

		for (const outpost of bundle.outposts) {
			rects.push([outpost, rensets.facilities.ally.outpost]);
		}
		rects.push([bundle.armory, rensets.facilities.ally.armory]);
		rects.push([bundle.scif, rensets.facilities.ally.scif]);
	}

	for (const bundle of enemyFacilityBundles) {
		rects.push([bundle.base, rensets.facilities.enemy.base]);
		rects.push([bundle.command, rensets.facilities.enemy.command]);
		for (const briefing of bundle.briefings) {
			rects.push([briefing, rensets.facilities.enemy.pickup]);
		}

		for (const outpost of bundle.outposts) {
			rects.push([outpost, rensets.facilities.enemy.outpost]);
		}
		rects.push([bundle.armory, rensets.facilities.enemy.armory]);
		rects.push([bundle.scif, rensets.facilities.enemy.scif]);
	}

	// Draw minefields
	for (const minefield of map.minefields) {
		if (Rect.isRect(minefield)) {
			rects.push([minefield, rensets.minefield.color]);
		} else if (Circle.isCircle(minefield)) {
			circles.push([minefield, rensets.minefield.color]);
		} else {
			// Can't get here
		}
	}

	// Draw safe zone and battlefield
	circles.push([map.safeZone, rensets.center.safe]);
	circles.push([map.battlefield, rensets.center.battlefield]);

	// Draw map boundaries
	const outer = map.rect.expand(rensets.mapBorder.width/2);
	const inner = map.rect.shrink(rensets.mapBorder.width/2);
	const overlaps = outer.overlap(inner);

	if (overlaps.first.left && overlaps.first.right && overlaps.first.top && overlaps.first.bottom) {
		rects.push([overlaps.first.left, rensets.mapBorder.color]);
		rects.push([overlaps.first.right, rensets.mapBorder.color]);
		rects.push([overlaps.first.top, rensets.mapBorder.color]);
		rects.push([overlaps.first.bottom, rensets.mapBorder.color]);
	}

	return {
		rects,
		circles
	};
}
