import camera from "./camera.ts";
import map from "../../common/map.ts";
import { SafeState } from "./state.ts";
import { Circle, Point, Rect } from "../../common/data-types/structures.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";
import { rensets } from "../../common/settings.ts";
import { Color } from "../../common/colors.ts";

function render(state: SafeState) {
	const selfPlayer = getSelf(state);
	setCamera(state, selfPlayer);
	renderBackground();
	renderPlayers(state, selfPlayer);
	renderMap();
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
	const center = selfPlayer.position;

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

function renderPlayers(state: SafeState, selfPlayer: ClientPlayer) {
	for (const player of state.playerMap.values()) {
		const circle = Circle(player.position, rensets.players.radius);
		let color: Color;

		if (player.id == state.self) {
			color = rensets.players.self;
		} else if (player.team == selfPlayer.team) {
			color = rensets.players.allies;
		} else {
			color = rensets.players.enemies;
		}

		camera.fillCircle(circle, color);
	}
}

function renderMap() {
	// Draw death rects
	for (const deathRect of map.deathRects) {
		camera.fillRect(deathRect, rensets.death.color);
	}

	// Draw map boundaries
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	camera.outlineRect(mapRect, rensets.mapBorder.color, rensets.mapBorder.width);
}

export default render;
