import { TeamName } from "../data-types/base.ts";
import { Circle } from "../shapes/Circle.ts";
import { Point } from "../shapes/Point.ts";
import { Rect } from "../shapes/Rect.ts";
import { Shape } from "../shapes/Shape.ts";
import { mapSettings } from "./MapSettings.ts";

export interface ChessWarMapTeamBundle {
	starts: Point[],
	command: Shape<Rect>,
	base: Shape<Rect>,
	briefings: Shape<Rect>[],
	outposts: Shape<Rect>[],
	armory: Shape<Rect>,
	scif: Shape<Rect>
}

export interface ChessWarMap {
	boundary: Shape<Rect>,
	teamBundles: {
		[TeamName.BLUE]: ChessWarMapTeamBundle,
		[TeamName.RED]: ChessWarMapTeamBundle
	},
	minefields: Shape<Rect | Circle>[],
	dmz: Shape<Circle>,
	battlefield: Shape<Circle>
}

export const rawMap: ChessWarMap = {
	boundary: mapSettings.mapShape,
	teamBundles: {
		[TeamName.BLUE]: {
			starts: [mapSettings.blueStart1, mapSettings.blueStart2, mapSettings.blueStart3],
			command: mapSettings.blueCommandShape,
			base: mapSettings.blueBaseShape,
			briefings: [mapSettings.blueBriefing1Shape, mapSettings.blueBriefing2Shape, mapSettings.blueBriefing3Shape],
			outposts: [mapSettings.blueOutpost1Shape, mapSettings.blueOutpost2Shape],
			armory: mapSettings.blueArmoryShape,
			scif: mapSettings.blueScifShape
		},
		[TeamName.RED]: {
			starts: [mapSettings.redStart1, mapSettings.redStart2, mapSettings.redStart3],
			command: mapSettings.redCommandShape,
			base: mapSettings.redBaseShape,
			briefings: [mapSettings.redBriefing1Shape, mapSettings.redBriefing2Shape, mapSettings.redBriefing3Shape],
			outposts: [mapSettings.redOutpost1Shape, mapSettings.redOutpost2Shape],
			armory: mapSettings.redArmoryShape,
			scif: mapSettings.redScifShape
		}
	},
	minefields: mapSettings.minefieldShapes,
	dmz: mapSettings.dmzShape,
	battlefield: mapSettings.battlefieldShape
};
