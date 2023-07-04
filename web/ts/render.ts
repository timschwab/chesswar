import map from "../../common/map.ts";
import { SafeState } from "./state.ts";
import { rensets } from "../../common/settings.ts";
import { Color } from "../../common/colors.ts";
import { renderGeneralWindow } from "./generalWindow.ts";
import { CWCanvas, TextAlign, fieldCanvas, uiCanvas } from "./canvas.ts";
import { renderBoard, teamPerspective } from "./chessboard.ts";
import { ChessMove } from "../../common/data-types/chess.ts";
import { PlayerRole, TeamName } from "../../common/data-types/base.ts";
import { Point, Rect } from "../../common/shapes/types.ts";
import { clampCircleInsideRect } from "../../common/shapes/clamp.ts";
import { CarryLoadType } from "../../common/data-types/carryLoad.ts";
import { BriefingName } from "../../common/data-types/facility.ts";
import { isCircle, isRect } from "../../common/shapes/is.ts";
import { CWCamera } from "./camera.ts";

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
	renderField(state);

	// Easiest way to do this right now
	if (state.uiNeedsRender) {
		renderUi(state);
		state.uiNeedsRender = false;
	}
}

function renderField(state: SafeState) {
	const fieldCamera = makeCamera(state);

	renderBackground(fieldCamera);
	renderMap(state, fieldCamera);
	renderPlayers(state, fieldCamera);
}

function renderUi(state: SafeState) {
	clearBackground(uiCanvas);

	renderRole(state, uiCanvas);
	if (state.self.role == PlayerRole.GENERAL) {
		renderGeneralWindow(state, uiCanvas);
	} else {
		renderMiniChessboard(state);
	}
	renderActionOption(state, uiCanvas);

	renderVictory(state, uiCanvas);

	if (state.stats.show) {
		renderStats(state, uiCanvas);
	}
}

function makeCamera(state: SafeState): CWCamera {
	const width = state.screen.width;
	const height = state.screen.height;
	const center = state.self.position.center;

	const topLeft = Point(center.x - width / 2, center.y - height / 2);
	const bottomRight = Point(
		center.x + width / 2,
		center.y + height / 2
	);

	const cameraRect = Rect(topLeft, bottomRight);

	return new CWCamera(fieldCanvas, cameraRect);
}

function renderBackground(fieldCamera: CWCamera) {
	// Fill in the background color
	fieldCamera.fillScreen(rensets.background);

	// Fill in the map background color
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	fieldCamera.fillRect(mapRect, rensets.grid.background);

	// Draw the vertical grid
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		const start = Point(x, 0);
		const finish = Point(x, map.height);
		fieldCamera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}

	// Draw the horizontal grid
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = Point(0, y);
		const finish = Point(map.width, y);
		fieldCamera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}
}

function renderMap(state: SafeState, fieldCamera: CWCamera) {
	// Draw facilities
	const allyFacilityBundles = map.facilities.filter(fac => fac.team == state.self.team);
	const enemyFacilityBundles = map.facilities.filter(fac => fac.team != state.self.team);

	for (const bundle of allyFacilityBundles) {
		fieldCamera.fillRect(bundle.base, rensets.facilities.ally.base);
		fieldCamera.fillRect(bundle.command, rensets.facilities.ally.command);
		for (const briefing of bundle.briefings) {
			fieldCamera.fillRect(briefing, rensets.facilities.ally.pickup);
		}

		for (const outpost of bundle.outposts) {
			fieldCamera.fillRect(outpost, rensets.facilities.ally.outpost);
		}
		fieldCamera.fillRect(bundle.armory, rensets.facilities.ally.armory);
		fieldCamera.fillRect(bundle.scif, rensets.facilities.ally.scif);
	}

	for (const bundle of enemyFacilityBundles) {
		fieldCamera.fillRect(bundle.base, rensets.facilities.enemy.base);
		fieldCamera.fillRect(bundle.command, rensets.facilities.enemy.command);
		for (const briefing of bundle.briefings) {
			fieldCamera.fillRect(briefing, rensets.facilities.enemy.pickup);
		}

		for (const outpost of bundle.outposts) {
			fieldCamera.fillRect(outpost, rensets.facilities.enemy.outpost);
		}
		fieldCamera.fillRect(bundle.armory, rensets.facilities.enemy.armory);
		fieldCamera.fillRect(bundle.scif, rensets.facilities.enemy.scif);
	}

	// Draw minefields
	for (const minefield of map.minefields) {
		if (isRect(minefield)) {
			fieldCamera.fillRect(minefield, rensets.minefield.color);
		} else if (isCircle(minefield)) {
			fieldCamera.fillCircle(minefield, rensets.minefield.color);
		} else {
			// Can't get here
		}
	}

	// Draw safe zone and battlefield
	fieldCamera.fillCircle(map.safeZone, rensets.center.safe);
	fieldCamera.fillCircle(map.battlefield, rensets.center.battlefield);

	// Draw map boundaries
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	fieldCamera.outlineRect(mapRect, rensets.mapBorder.color, rensets.mapBorder.width);
}

function renderPlayers(state: SafeState, fieldCamera: CWCamera) {
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
			pos = clampCircleInsideRect(fieldCamera.getRect(), pos);
		}

		fieldCamera.fillCircle(pos, color);

		if (player.deathCounter > 0) {
			const textRectTopLeft = Point(pos.center.x - pos.radius, pos.center.y - pos.radius);
			const textRectBottomRight = Point(pos.center.x + pos.radius, pos.center.y + pos.radius);
			const textRect = Rect(textRectTopLeft, textRectBottomRight);
			fieldCamera.text(textRect, TextAlign.CENTER, String(player.deathCounter), rensets.players.deathCounter.font, rensets.players.deathCounter.color);
		}

		const nameRect = Rect(Point(pos.center.x, pos.center.y+pos.radius+10), Point(pos.center.x, pos.center.y+pos.radius+10));
		fieldCamera.text(nameRect, TextAlign.CENTER, player.id.slice(0, 4), rensets.players.name.font, rensets.players.name.color);
	}
}

function clearBackground(uiCanvas: CWCanvas) {
	uiCanvas.clear();
}

function renderRole(state: SafeState, uiCanvas: CWCanvas) {
	const textRect = Rect(Point(10, 10), Point(200, 30));
	uiCanvas.fillRect(textRect, rensets.currentRole.teamColor[state.self.team]);
	uiCanvas.outlineRect(textRect, rensets.currentRole.outlineColor, rensets.currentRole.outlineWidth);
	uiCanvas.text(textRect, TextAlign.CENTER, "You are a: " + state.self.role, rensets.currentRole.textFont, rensets.currentRole.textColor)
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

function renderActionOption(state: SafeState, uiCanvas: CWCanvas) {
	const actionOption = state.self.actionOption;

	const actionRectWidth = 500;
	const actionTopLeft = Point(state.screen.center.x-(actionRectWidth/2), 10);
	const actionBottomRight = Point(state.screen.center.x+(actionRectWidth/2), 50);
	const actionRect = Rect(actionTopLeft, actionBottomRight);

	uiCanvas.fillRect(actionRect, rensets.actionOption.backgroundColor);
	uiCanvas.outlineRect(actionRect, rensets.actionOption.outlineColor, rensets.actionOption.outlineWidth);
	uiCanvas.text(actionRect, TextAlign.CENTER, "Available action: " + (actionOption || ""), rensets.actionOption.textFont, rensets.actionOption.textColor);
}

function renderVictory(state: SafeState, uiCanvas: CWCanvas) {
	if (state.victory == null) {
		return;
	}
	
	if (state.victory == "tie") {
		uiCanvas.text(state.screen, TextAlign.CENTER, "It's a tie!", rensets.victory.font, rensets.victory.color);
	} else if (state.victory == TeamName.BLUE) {
		uiCanvas.text(state.screen, TextAlign.CENTER, "Blue team wins!", rensets.victory.font, rensets.victory.color);
	} else if (state.victory == TeamName.RED) {
		uiCanvas.text(state.screen, TextAlign.CENTER, "Red team wins!", rensets.victory.font, rensets.victory.color);
	}

	const newGameTicksRectTopLeft = Point(state.screen.topLeft.x, state.screen.bottomRight.y/2);
	const newGameTicksRect = Rect(newGameTicksRectTopLeft, state.screen.bottomRight);
	uiCanvas.text(newGameTicksRect, TextAlign.CENTER, "New game in: " + state.newGameCounter, rensets.victory.newGameFont, rensets.victory.newGameColor);
}

function renderStats(state: SafeState, uiCanvas: CWCanvas) {
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
		uiCanvas.text(rect, TextAlign.LEFT, stat, rensets.stats.font, rensets.stats.color);
		rect = Rect(Point(rect.topLeft.x, rect.topLeft.y+20), Point(rect.bottomRight.x, rect.bottomRight.y+20));
	}
}

export default render;
