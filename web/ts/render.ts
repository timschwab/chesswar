import camera from "./camera.ts";
import map from "../../common/map.ts";
import { SafeState } from "./state.ts";
import { Point, Rect } from "../../common/data-types/shapes.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";
import { rensets } from "../../common/settings.ts";
import { Color } from "../../common/colors.ts";

function render(state: SafeState) {
	const selfPlayer = getSelf(state);
	setCamera(state, selfPlayer);
	renderBackground();
	renderMap(selfPlayer);
	renderPlayers(state, selfPlayer);
}

function getSelf(state: SafeState): ClientPlayer {
	const maybeSelf = state.playerMap.get(state.self);

	if (!maybeSelf) {
		console.error(state.playerMap, state.self);
		throw "Could not find self";
	}

	return maybeSelf;
}

function setCamera(state: SafeState, selfPlayer: ClientPlayer) {
	const width = state.screen.width;
	const height = state.screen.height;
	const center = selfPlayer.position.center;

	const topLeft = Point(center.x - width / 2, center.y - height / 2);
	const bottomRight = Point(
		center.x + width / 2,
		center.y + height / 2
	);

	const cameraRect = Rect(topLeft, bottomRight);

	camera.setCamera(cameraRect);
}

function renderBackground() {
	// Fill in the background color
	camera.fillScreen(rensets.background);

	// Fill in the map background color
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	camera.fillRect(mapRect, rensets.grid.background);

	// Draw the vertical grid
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		const start = Point(x, 0);
		const finish = Point(x, map.height);
		camera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}

	// Draw the horizontal grid
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = Point(0, y);
		const finish = Point(map.width, y);
		camera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}
}

function renderMap(selfPlayer: ClientPlayer) {
	// Draw facilities
	const allyFacilityBundles = map.facilities.filter(fac => fac.team == selfPlayer.team);
	const enemyFacilityBundles = map.facilities.filter(fac => fac.team != selfPlayer.team);

	for (const bundle of allyFacilityBundles) {
		for (const outpost of bundle.outposts) {
			camera.fillRect(outpost, rensets.facilities.ally.outpost);
		}

		camera.fillRect(bundle.base, rensets.facilities.ally.base);
		camera.fillRect(bundle.command, rensets.facilities.ally.command);
	}

	for (const bundle of enemyFacilityBundles) {
		for (const outpost of bundle.outposts) {
			camera.fillRect(outpost, rensets.facilities.enemy.outpost);
		}

		camera.fillRect(bundle.base, rensets.facilities.enemy.base);
		camera.fillRect(bundle.command, rensets.facilities.enemy.command);
	}

	// Draw death rects
	for (const deathRect of map.deathRects) {
		camera.fillRect(deathRect, rensets.death.color);
	}

	// Draw death circles
	for (const deathCircle of map.deathCircles) {
		camera.fillCircle(deathCircle, rensets.death.color);
	}

	// Draw safe zone
	camera.fillCircle(map.safeZone, rensets.safe.color);

	// Draw map boundaries
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	camera.outlineRect(mapRect, rensets.mapBorder.color, rensets.mapBorder.width);
}

function renderPlayers(state: SafeState, selfPlayer: ClientPlayer) {
	for (const player of state.playerMap.values()) {
		let color: Color;

		if (player.id == state.self) {
			color = rensets.players.self;
		} else if (player.team == selfPlayer.team) {
			color = rensets.players.allies;
		} else {
			color = rensets.players.enemies;
		}

		camera.fillCircle(player.position, color);
	}
}

export default render;
