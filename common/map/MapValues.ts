import { TeamName } from "../data-types/base.ts";
import rawMap, { ChessWarMap, ChessWarMapTeamValue } from "./ChessWarMap.ts";

function transformMap<V1, V2>(map: ChessWarMap<V1>, transformer: (value: V1) => V2): ChessWarMap<V2> {
	return {
		boundary: transformer(map.boundary),
		teamValues: {
			[TeamName.BLUE]: transformTeamValue(map.teamValues[TeamName.BLUE], transformer),
			[TeamName.RED]: transformTeamValue(map.teamValues[TeamName.RED], transformer)
		},
		minefields: map.minefields.map(transformer),
		dmz: transformer(map.dmz),
		battlefield: transformer(map.battlefield)
	}
}

function transformTeamValue<V1, V2>(teamValue: ChessWarMapTeamValue<V1>, transformer: (value: V1) => V2): ChessWarMapTeamValue<V2> {
	return {
		starts: teamValue.starts,
		command: transformer(teamValue.command),
		base: transformer(teamValue.base),
		briefings: teamValue.briefings.map(transformer),
		outposts: teamValue.outposts.map(transformer),
		armory: transformer(teamValue.base),
		scif: transformer(teamValue.base)
	};
}

// For ticking on the server
export const mapGeometry = transformMap(rawMap, value => value.geo);

// For rendering on the client
const mapStructures = transformMap(rawMap, value => value.toStructure());
export const mapStructuresList = [
	mapStructures.boundary,

	mapStructures.teamValues[TeamName.BLUE].command,
	mapStructures.teamValues[TeamName.BLUE].briefings,
	mapStructures.teamValues[TeamName.BLUE].outposts,
	mapStructures.teamValues[TeamName.BLUE].armory,
	mapStructures.teamValues[TeamName.BLUE].scif,

	mapStructures.teamValues[TeamName.RED].command,
	mapStructures.teamValues[TeamName.RED].briefings,
	mapStructures.teamValues[TeamName.RED].outposts,
	mapStructures.teamValues[TeamName.RED].armory,
	mapStructures.teamValues[TeamName.RED].scif,

	mapStructures.minefields,
	mapStructures.dmz,
	mapStructures.battlefield
].flat();
