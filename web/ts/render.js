import settings from "./settings.js";
import structures from "./structures.js";
import camera from "./camera.js";
import map from "../../common/map.ts";

let rensets = settings.rendering;

function render(state) {
	setCamera(state);
	renderBackground(state);
	renderPlayers(state);
	renderMap(state);
}

function setCamera(state) {
	let width = state.screen.width;
	let height = state.screen.height;
	let center = state.players[state.self].position;

	let topLeft = structures.point(center.x - width / 2, center.y - height / 2);
	let bottomRight = structures.point(
		center.x + width / 2,
		center.y + height / 2
	);

	let cameraRect = structures.rect(topLeft, bottomRight);

	camera.setCamera(cameraRect);
}

function renderBackground(state) {
	// Fill in the background color
	camera.fillScreen(rensets.background);

	// Fill in the map background color
	let mapTopLeft = structures.point(0, 0);
	let mapBottomRight = structures.point(map.width, map.height);
	let mapRect = structures.rect(mapTopLeft, mapBottomRight);
	camera.fillRect(mapRect, rensets.grid.background);

	// Draw the vertical grid
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		let start = structures.point(x, 0);
		let finish = structures.point(x, map.height);
		camera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}

	// Draw the horizontal grid
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		let start = structures.point(0, y);
		let finish = structures.point(map.width, y);
		camera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}
}

function renderPlayers(state) {
	for (let id of Object.keys(state.players)) {
		let player = state.players[id];
		let circle = structures.circle(player.position, rensets.players.radius);
		let color;

		if (id == state.self) {
			color = rensets.players.self;
		} else {
			color = rensets.players.enemies;
		}

		camera.fillCircle(circle, color);
	}
}

function renderMap(state) {
	// Draw death rects
	for (let deathRect of map.deathRects) {
		camera.fillRect(deathRect, rensets.death.color);
	}

	// Draw map boundaries
	let mapTopLeft = structures.point(0, 0);
	let mapBottomRight = structures.point(map.width, map.height);
	let mapRect = structures.rect(mapTopLeft, mapBottomRight);
	camera.outlineRect(mapRect, rensets.mapBorder.color, rensets.mapBorder.width);
}

export default render;
