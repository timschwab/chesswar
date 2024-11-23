import { TeamName } from "../data-types/base.ts";
import { Structure } from "../shapes/Structure.ts";
import { ChessWarMap, ChessWarMapTeamBundle, rawMap } from "./ChessWarMap.ts";

function getMapGeometry(map: ChessWarMap) {
	return {
		rect: map.rect.geo,
		teamBundles: {
			[TeamName.BLUE]: getTeamBundleGeometry(map.teamBundles[TeamName.BLUE]),
			[TeamName.RED]: getTeamBundleGeometry(map.teamBundles[TeamName.RED])
		},
		minefields: map.minefields.map(minefield => minefield.geo),
		dmz: map.dmz.geo,
		battlefield: map.battlefield.geo
	};
}

function getTeamBundleGeometry(teamBundle: ChessWarMapTeamBundle) {
	return {
		starts: teamBundle.starts,
		command: teamBundle.command.geo,
		base: teamBundle.base.geo,
		briefings: teamBundle.briefings.map(briefing => briefing.geo),
		outposts: teamBundle.outposts.map(outpost => outpost.geo),
		armory: teamBundle.base.geo,
		scif: teamBundle.base.geo
	};
}

function getMapStructures(map: ChessWarMap): Structure[] {
	// Note that order matters because it determins draw order
	return [
		map.rect.toStructure(),
		map.grid.map(line => line.toStructure()),
		getTeamBundleStructures(map.teamBundles[TeamName.BLUE]),
		getTeamBundleStructures(map.teamBundles[TeamName.RED]),
		map.boundaries.map(boundary => boundary.toStructure()),
		map.minefields.map(minefield => minefield.toStructure()),
		map.dmz.toStructure(),
		map.battlefield.toStructure(),
	].flat();
}

function getTeamBundleStructures(teamBundle: ChessWarMapTeamBundle): Structure[] {
	return [
		teamBundle.base.toStructure(),
		teamBundle.command.toStructure(),
		teamBundle.briefings.map(briefing => briefing.toStructure()),
		teamBundle.outposts.map(outpost => outpost.toStructure()),
		teamBundle.armory.toStructure(),
		teamBundle.scif.toStructure()
	].flat();
}

// For ticking on the server
export const mapGeometry = getMapGeometry(rawMap);

// For rendering on the client
export const mapStructures = getMapStructures(rawMap);
