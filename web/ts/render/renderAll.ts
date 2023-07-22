import { SafeState } from "../state.ts";
import { rensets } from "../../../common/settings.ts";
import { renderGeneralWindow } from "../generalWindow.ts";
import { CWCanvas, TextAlign, fieldCanvas, uiCanvas } from "../canvas.ts";
import { renderBoard, teamPerspective } from "../chessboard.ts";
import { ChessMove } from "../../../common/data-types/chess.ts";
import { PlayerRole, TeamName } from "../../../common/data-types/base.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { CarryLoadType } from "../../../common/data-types/carryLoad.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { CWCamera } from "../camera.ts";
import { renderBackground } from "./renderBackground.ts";
import { renderMap } from "./renderMap.ts";
import { renderPlayers } from "./renderPlayers.ts";

export function renderAll(state: SafeState) {
	renderField(state);
	renderUi(state);
}

function renderField(state: SafeState) {
	const fieldCamera = makeCamera(state);

	renderBackground(fieldCamera);
	renderMap(state, fieldCamera);
	renderPlayers(state, fieldCamera);
}

function renderUi(state: SafeState) {
	uiCanvas.clear();

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

function renderRole(state: SafeState, uiCanvas: CWCanvas) {
	const textRect = Rect(Point(10, 10), Point(200, 30));
	uiCanvas.fillRect(textRect, rensets.currentRole.teamColor[state.self.team]);
	uiCanvas.outlineRect(textRect, rensets.currentRole.outlineColor, rensets.currentRole.outlineWidth);
	uiCanvas.text(textRect, TextAlign.CENTER, "You are a: " + state.self.role, rensets.currentRole.textFont, rensets.currentRole.textColor)
}

function renderMiniChessboard(state: SafeState) {
	const boardRect1 = Rect(Point(10, 40), Point(10+(8*20), 40+(8*20)));
	const perspective = teamPerspective(state.self.team);

	renderBoard(boardRect1, state.teamBoard.value(), [], perspective);

	if (state.carrying.type == CarryLoadType.EMPTY) {
		// Don't render the second board
	} else {
		const boardRect2 = Rect(Point(10, 40+10+(8*20)), Point(10+(8*20), 40+10+2*((8*20))));
		let board = state.teamBoard.value();
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
	const prevPingDelayMs = state.stats.prevPingDelayMs.toFixed(0);
	const serverTickMs = state.stats.server.tickMs.toFixed(3);
	const serverTicksPerSec = (1000 / state.stats.server.tickMs).toFixed(0);
	const playersOnline = String(state.playerMap.size);

	const stats = [
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
