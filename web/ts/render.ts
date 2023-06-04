import camera from "./camera.ts";
import map from "../../common/map.ts";
import { SafeState } from "./state.ts";
import { Point, Rect } from "../../common/data-types/shapes.ts";
import { rensets } from "../../common/settings.ts";
import { Color } from "../../common/colors.ts";
import { PlayerRole, TeamName } from "../../common/data-types/base.ts";
import { renderGeneralWindow } from "./generalWindow.ts";
import canvas from "./canvas.ts";
import { renderBoard } from "./chessboard.ts";
import { ChessMove } from "../../common/data-types/chess.ts";
import { CarryLoadType } from "../../common/data-types/server.ts";

function render(state: SafeState) {
	const startRender = performance.now();
	renderAll(state);
	const endRender = performance.now();
	const renderMs = endRender-startRender;

	// Only once a second, so that they are easy to read
	if (state.count % 60 == 0) {
		state.stats.clientRenderMs = renderMs;
	}
}

function renderAll(state: SafeState) {
	setCamera(state);

	renderBackground();
	renderMap(state);
	renderPlayers(state);

	if (state.self.role == PlayerRole.GENERAL) {
		renderGeneralWindow(state);
	} else {
		renderMiniChessboard(state);
	}

	renderActionOption(state);

	renderVictory(state);
	renderStats(state);
}

function setCamera(state: SafeState) {
	const width = state.screen.width;
	const height = state.screen.height;
	const center = state.self.position.center;

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

function renderMap(state: SafeState) {
	// Draw facilities
	const allyFacilityBundles = map.facilities.filter(fac => fac.team == state.self.team);
	const enemyFacilityBundles = map.facilities.filter(fac => fac.team != state.self.team);

	for (const bundle of allyFacilityBundles) {
		camera.fillRect(bundle.base, rensets.facilities.ally.base);
		camera.fillRect(bundle.command, rensets.facilities.ally.command);
		for (const briefing of bundle.briefings) {
			camera.fillRect(briefing, rensets.facilities.ally.pickup);
		}

		for (const outpost of bundle.outposts) {
			camera.fillRect(outpost, rensets.facilities.ally.outpost);
		}
		camera.fillRect(bundle.armory, rensets.facilities.ally.armory);
		camera.fillRect(bundle.intel, rensets.facilities.ally.intel);
	}

	for (const bundle of enemyFacilityBundles) {
		camera.fillRect(bundle.base, rensets.facilities.enemy.base);
		camera.fillRect(bundle.command, rensets.facilities.enemy.command);
		for (const briefing of bundle.briefings) {
			camera.fillRect(briefing, rensets.facilities.enemy.pickup);
		}

		for (const outpost of bundle.outposts) {
			camera.fillRect(outpost, rensets.facilities.enemy.outpost);
		}
		camera.fillRect(bundle.armory, rensets.facilities.enemy.armory);
		camera.fillRect(bundle.intel, rensets.facilities.enemy.intel);
	}

	// Draw death rects
	for (const deathRect of map.deathRects) {
		camera.fillRect(deathRect, rensets.death.color);
	}

	// Draw death circles
	for (const deathCircle of map.deathCircles) {
		camera.fillCircle(deathCircle, rensets.death.color);
	}

	// Draw safe zone and battlefield
	camera.fillCircle(map.safeZone, rensets.center.safe);
	camera.fillCircle(map.battlefield, rensets.center.battlefield);

	// Draw map boundaries
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	camera.outlineRect(mapRect, rensets.mapBorder.color, rensets.mapBorder.width);
}

function renderPlayers(state: SafeState) {
	for (const player of state.playerMap.values()) {
		let color: Color;

		if (player.id == state.selfId) {
			color = rensets.players.self;
		} else if (player.team == state.self.team) {
			color = rensets.players.allies;
		} else {
			color = rensets.players.enemies;
		}

		camera.fillCircle(player.position, color);
	}
}

function renderMiniChessboard(state: SafeState) {
	const boardRect = Rect(Point(10, 10), Point(10+(8*20), 10+(8*20)));

	const moves = [] as ChessMove[];
	if (state.carrying.type == CarryLoadType.MOVE) {
		moves.push(state.carrying.load);
	}
	renderBoard(boardRect, state.teamBoard, moves);

	if (state.carrying.type == CarryLoadType.BOARD) {
		const boardRect = Rect(Point(10, 10+10+(8*20)), Point(10+(8*20), 2*(10+(8*20))));
		renderBoard(boardRect, state.carrying.load, []);
	}
}

function renderActionOption(state: SafeState) {
	const actionOption = state.self.actionOption;

	const actionRectWidth = 500;
	const actionTopLeft = Point(state.screen.center.x-(actionRectWidth/2), 10);
	const actionBottomRight = Point(state.screen.center.x+(actionRectWidth/2), 50);
	const actionRect = Rect(actionTopLeft, actionBottomRight);

	canvas.fillRect(actionRect, rensets.actionOption.backgroundColor);
	canvas.outlineRect(actionRect, rensets.actionOption.outlineColor, rensets.actionOption.outlineWidth);
	canvas.text(actionRect, "center", "Available action: " + (actionOption || ""), rensets.actionOption.textFont, rensets.actionOption.textColor)
}

function renderVictory(state: SafeState) {
	if (state.victory == null) {
		// Do nothing
	} else if (state.victory == "tie") {
		canvas.text(state.screen, "center", "It's a tie!", rensets.victory.font, rensets.victory.color);
	} else if (state.victory == TeamName.ALPHA) {
		canvas.text(state.screen, "center", "Team Alpha wins!", rensets.victory.font, rensets.victory.color);
	} else if (state.victory == TeamName.BRAVO) {
		canvas.text(state.screen, "center", "Team Bravo wins!", rensets.victory.font, rensets.victory.color);
	}
}

function renderStats(state: SafeState) {
	const clientRenderMs = state.stats.clientRenderMs.toFixed(3);
	const clientRendersPerSec = (1000 / state.stats.clientRenderMs).toFixed(0);
	const prevPingDelayMs = state.stats.prevPingDelayMs.toFixed(0);
	const serverTickMs = state.stats.server.tickMs.toFixed(3);
	const serverTicksPerSec = (1000 / state.stats.server.tickMs).toFixed(0);

	const stats = [
		`clientRenderMs: ${clientRenderMs}`,
		`clientRendersPerSec: ${clientRendersPerSec}`,
		`prevPingDelayMs: ${prevPingDelayMs}`,
		`serverTickMs: ${serverTickMs}`,
		`serverTicksPerSec: ${serverTicksPerSec}`
	];

	let rect = Rect(Point(10, state.screen.height-(20*stats.length)), Point(100, state.screen.height-(20*stats.length)-20));
	for (const stat of stats) {
		canvas.text(rect, "left", stat, rensets.stats.font, rensets.stats.color);
		rect = Rect(Point(rect.topLeft.x, rect.topLeft.y+20), Point(rect.bottomRight.x, rect.bottomRight.y+20));
	}
}

export default render;
