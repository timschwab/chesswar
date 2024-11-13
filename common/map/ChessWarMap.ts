import { TeamName } from "../data-types/base.ts";
import { Point } from "../shapes/Point.ts";
import { UnknownShape } from "../shapes/Shape.ts";
import { mapSettings } from "./MapSettings.ts";

export interface ChessWarMapTeamValue<T> {
	starts: Point[],
	command: T,
	base: T,
	briefings: T[],
	outposts: T[],
	armory: T,
	scif: T
}

export interface ChessWarMap<T> {
	boundary: T,
	teamValues: {
		[TeamName.BLUE]: ChessWarMapTeamValue<T>,
		[TeamName.RED]: ChessWarMapTeamValue<T>
	},
	minefields: T[],
	dmz: T,
	battlefield: T
}

const rawMap: ChessWarMap<UnknownShape> = {
	boundary: mapSettings.mapShape,
	teamValues: {
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

export default rawMap;
