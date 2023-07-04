import camera from "./camera.ts";
import map from "../../common/map.ts";
import { SafeState } from "./state.ts";
import { rensets } from "../../common/settings.ts";
import { Color } from "../../common/colors.ts";
import { renderGeneralWindow } from "./generalWindow.ts";
import canvas, { TextAlign } from "./canvas.ts";
import { renderBoard, teamPerspective } from "./chessboard.ts";
import { ChessMove } from "../../common/data-types/chess.ts";
import { PlayerRole, TeamName } from "../../common/data-types/base.ts";
import { Point, Rect } from "../../common/shapes/types.ts";
import { clampCircleInsideRect } from "../../common/shapes/clamp.ts";
import { CarryLoadType } from "../../common/data-types/carryLoad.ts";
import { BriefingName } from "../../common/data-types/facility.ts";
import { isCircle, isRect } from "../../common/shapes/is.ts";

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

	renderRole(state);
	if (state.self.role == PlayerRole.GENERAL) {
		renderGeneralWindow(state);
	} else {
		renderMiniChessboard(state);
	}
	renderActionOption(state);

	renderVictory(state);

	if (state.stats.show) {
		renderStats(state);
	}
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
		camera.fillRect(bundle.scif, rensets.facilities.ally.scif);
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
		camera.fillRect(bundle.scif, rensets.facilities.enemy.scif);
	}

	// Draw minefields
	for (const minefield of map.minefields) {
		if (isRect(minefield)) {
			camera.fillRect(minefield, rensets.minefield.color);
		} else if (isCircle(minefield)) {
			camera.fillCircle(minefield, rensets.minefield.color);
		} else {
			// Can't get here
		}
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
		} else {
			color = rensets.players.teamColor[player.team];
		}

		let pos = player.position;
		const isEnemy = player.team != state.self.team;
		const isSoldierOrTank = player.role == PlayerRole.SOLDIER || player.role == PlayerRole.TANK;
		if (state.self.role == PlayerRole.TANK && isEnemy && isSoldierOrTank) {
			pos = clampCircleInsideRect(camera.getCamera(), pos);
		}

		camera.fillCircle(pos, color);

		if (player.deathCounter > 0) {
			const textRectTopLeft = Point(pos.center.x - pos.radius, pos.center.y - pos.radius);
			const textRectBottomRight = Point(pos.center.x + pos.radius, pos.center.y + pos.radius);
			const textRect = Rect(textRectTopLeft, textRectBottomRight);
			camera.text(textRect, TextAlign.CENTER, String(player.deathCounter), rensets.players.deathCounter.font, rensets.players.deathCounter.color);
		}

		const nameRect = Rect(Point(pos.center.x, pos.center.y+pos.radius+10), Point(pos.center.x, pos.center.y+pos.radius+10));
		camera.text(nameRect, TextAlign.CENTER, player.id.slice(0, 4), rensets.players.name.font, rensets.players.name.color);
	}
}

function renderRole(state: SafeState) {
	const textRect = Rect(Point(10, 10), Point(200, 30));
	canvas.fillRect(textRect, rensets.currentRole.teamColor[state.self.team]);
	canvas.outlineRect(textRect, rensets.currentRole.outlineColor, rensets.currentRole.outlineWidth);
	canvas.text(textRect, TextAlign.CENTER, "You are a: " + state.self.role, rensets.currentRole.textFont, rensets.currentRole.textColor)
}

function renderMiniChessboard(state: SafeState) {
	const boardRect1 = Rect(Point(10, 40), Point(10+(8*20), 40+(8*20)));
	const perspective = teamPerspective(state.self.team);

	renderBoard(boardRect1, state.teamBoard, [], perspective);

	if (state.carrying.type == CarryLoadType.EMPTY) {
		// Don't render the second board
	} else {
		const boardRect2 = Rect(Point(10, 40+10+(8*20)), Point(10+(8*20), 40+10+2*((8*20))));
		let board = state.teamBoard;
		const moves = [] as ChessMove[];

		if (state.carrying.type == CarryLoadType.ORDERS) {
			moves.push(state.carrying.load);
		} else if (state.carrying.type == CarryLoadType.ESPIONAGE) {
			const load = state.carrying.load;
			load[BriefingName.ONE] && moves.push(load[BriefingName.ONE]);
			load[BriefingName.TWO] && moves.push(load[BriefingName.TWO]);
			load[BriefingName.THREE] && moves.push(load[BriefingName.THREE]);
		} else if (state.carrying.type == CarryLoadType.INTEL) {
			board = state.carrying.load;
		}

		renderBoard(boardRect2, board, moves, perspective);
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
	canvas.text(actionRect, TextAlign.CENTER, "Available action: " + (actionOption || ""), rensets.actionOption.textFont, rensets.actionOption.textColor);
}

function renderVictory(state: SafeState) {
	if (state.victory == null) {
		return;
	}
	
	if (state.victory == "tie") {
		canvas.text(state.screen, TextAlign.CENTER, "It's a tie!", rensets.victory.font, rensets.victory.color);
	} else if (state.victory == TeamName.BLUE) {
		canvas.text(state.screen, TextAlign.CENTER, "Blue team wins!", rensets.victory.font, rensets.victory.color);
	} else if (state.victory == TeamName.RED) {
		canvas.text(state.screen, TextAlign.CENTER, "Red team wins!", rensets.victory.font, rensets.victory.color);
	}

	const newGameTicksRectTopLeft = Point(state.screen.topLeft.x, state.screen.bottomRight.y/2);
	const newGameTicksRect = Rect(newGameTicksRectTopLeft, state.screen.bottomRight);
	canvas.text(newGameTicksRect, TextAlign.CENTER, "New game in: " + state.newGameCounter, rensets.victory.newGameFont, rensets.victory.newGameColor);
}

function renderStats(state: SafeState) {
	const clientRenderMs = state.stats.clientRenderMs.toFixed(3);
	const clientRendersPerSec = (1000 / state.stats.clientRenderMs).toFixed(0);
	const prevPingDelayMs = state.stats.prevPingDelayMs.toFixed(0);
	const serverTickMs = state.stats.server.tickMs.toFixed(3);
	const serverTicksPerSec = (1000 / state.stats.server.tickMs).toFixed(0);
	const playersOnline = String(state.playerMap.size);

	const stats = [
		`clientRenderMs: ${clientRenderMs}`,
		`clientRendersPerSec: ${clientRendersPerSec}`,
		`prevPingDelayMs: ${prevPingDelayMs}`,
		`serverTickMs: ${serverTickMs}`,
		`serverTicksPerSec: ${serverTicksPerSec}`,
		`playersOnline: ${playersOnline}`
	];

	let rect = Rect(Point(10, state.screen.height-(20*stats.length)), Point(100, state.screen.height-(20*stats.length)-20));
	for (const stat of stats) {
		canvas.text(rect, TextAlign.LEFT, stat, rensets.stats.font, rensets.stats.color);
		rect = Rect(Point(rect.topLeft.x, rect.topLeft.y+20), Point(rect.bottomRight.x, rect.bottomRight.y+20));
	}
}

export default render;
