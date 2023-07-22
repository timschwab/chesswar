import map from "../../../common/map.ts";
import { rensets } from "../../../common/settings.ts";
import { isCircle, isRect } from "../../../common/shapes/is.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { CWCamera } from "../camera.ts";
import { SafeState } from "../state.ts";

export function renderMap(state: SafeState, fieldCamera: CWCamera) {
	// Draw facilities
	const allyFacilityBundles = map.facilities.filter(fac => fac.team == state.self.team);
	const enemyFacilityBundles = map.facilities.filter(fac => fac.team != state.self.team);

	for (const bundle of allyFacilityBundles) {
		fieldCamera.fillRect(bundle.base, rensets.facilities.ally.base);
		fieldCamera.fillRect(bundle.command, rensets.facilities.ally.command);
		for (const briefing of bundle.briefings) {
			fieldCamera.fillRect(briefing, rensets.facilities.ally.pickup);
		}

		for (const outpost of bundle.outposts) {
			fieldCamera.fillRect(outpost, rensets.facilities.ally.outpost);
		}
		fieldCamera.fillRect(bundle.armory, rensets.facilities.ally.armory);
		fieldCamera.fillRect(bundle.scif, rensets.facilities.ally.scif);
	}

	for (const bundle of enemyFacilityBundles) {
		fieldCamera.fillRect(bundle.base, rensets.facilities.enemy.base);
		fieldCamera.fillRect(bundle.command, rensets.facilities.enemy.command);
		for (const briefing of bundle.briefings) {
			fieldCamera.fillRect(briefing, rensets.facilities.enemy.pickup);
		}

		for (const outpost of bundle.outposts) {
			fieldCamera.fillRect(outpost, rensets.facilities.enemy.outpost);
		}
		fieldCamera.fillRect(bundle.armory, rensets.facilities.enemy.armory);
		fieldCamera.fillRect(bundle.scif, rensets.facilities.enemy.scif);
	}

	// Draw minefields
	for (const minefield of map.minefields) {
		if (isRect(minefield)) {
			fieldCamera.fillRect(minefield, rensets.minefield.color);
		} else if (isCircle(minefield)) {
			fieldCamera.fillCircle(minefield, rensets.minefield.color);
		} else {
			// Can't get here
		}
	}

	// Draw safe zone and battlefield
	fieldCamera.fillCircle(map.safeZone, rensets.center.safe);
	fieldCamera.fillCircle(map.battlefield, rensets.center.battlefield);

	// Draw map boundaries
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	fieldCamera.outlineRect(mapRect, rensets.mapBorder.color, rensets.mapBorder.width);
}
