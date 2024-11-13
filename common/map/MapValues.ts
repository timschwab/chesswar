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

export const mapGeometry = transformMap(rawMap, value => value.geo);
export const mapTriangles = transformMap(rawMap, value => value.toTriangles());
