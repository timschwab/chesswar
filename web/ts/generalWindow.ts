import { CWCanvas } from "./canvas.ts";
import { renderBoard, teamPerspective, unrotateSquare } from "./chessboard.ts";
import { SafeState } from "./state.ts";
import { ChessMove, ChessSquare } from "../../common/data-types/chess.ts";
import { rensets } from "../../common/settings.ts";
import { BriefingName } from "../../common/data-types/facility.ts";
import { Point, Rect } from "../../common/shapes/types.ts";
import { transposePoint } from "../../common/shapes/transpose.ts";
import { inside } from "../../common/shapes/inside.ts";

export function renderGeneralWindow(state: SafeState, uiCanvas: CWCanvas): void {
	const values = getKeyValues(state);
	const genwin = rensets.generalWindow;

	// Draw window
	uiCanvas.fillRect(values.windowRect, genwin.windowInside);
	uiCanvas.outlineRect(values.windowRect, genwin.windowOutline, 5);

	// Draw chessboard squares
	const teamMoves = [state.briefings[BriefingName.ONE], state.briefings[BriefingName.TWO], state.briefings[BriefingName.THREE]];
	teamMoves.push(state.general.selectedFrom ? {from: state.general.selectedFrom, to: state.general.selectedFrom, team: state.self.team} : null);
	
	const enemyMoves = [state.enemyBriefings[BriefingName.ONE], state.enemyBriefings[BriefingName.TWO], state.enemyBriefings[BriefingName.THREE]];

	let moves = enemyMoves.concat(teamMoves);
	moves = moves.filter(move => move != null);

	const perspective = teamPerspective(state.self.team);
	renderBoard(values.boardRect, state.teamBoard, moves as ChessMove[], perspective);

	// Draw buttons
	uiCanvas.fillRect(values.button1Rect, genwin.button);
	uiCanvas.fillRect(values.button2Rect, genwin.button);
	uiCanvas.fillRect(values.button3Rect, genwin.button);

	// Draw selected button
	if (state.general.selectedButton == BriefingName.ONE) {
		uiCanvas.outlineRect(values.button1Rect, genwin.teamColor[state.self.team], 3);
	} else if (state.general.selectedButton == BriefingName.TWO) {
		uiCanvas.outlineRect(values.button2Rect, genwin.teamColor[state.self.team], 3);
	} else if (state.general.selectedButton == BriefingName.THREE) {
		uiCanvas.outlineRect(values.button3Rect, genwin.teamColor[state.self.team], 3);
	}
}

function getKeyValues(state: SafeState) {
	const genwin = rensets.generalWindow;

	const padding = genwin.padding;
	const squareSize = genwin.squareSize;
	const buttonSize = genwin.buttonSize;

	const boardSize = squareSize*8;
	const windowWidth = padding + boardSize + padding + buttonSize + padding;
	const windowHeight = padding + boardSize + padding;

	const middleX = state.screen.width/2;
	const middleY = state.screen.height/2;

	const topLeftX = middleX - windowWidth/2;
	const topLeftY = middleY - windowHeight/2;
	const bottomRightX = middleX + windowWidth/2;
	const bottomRightY = middleY + windowHeight/2;

	const windowRect = Rect(Point(topLeftX, topLeftY), Point(bottomRightX, bottomRightY));

	const boardTopLeftX = topLeftX + padding;
	const boardTopLeftY = topLeftY + padding;
	const boardRect = Rect(Point(boardTopLeftX, boardTopLeftY), Point(topLeftX+boardSize+padding, topLeftY+boardSize+padding));

	const buttonX = topLeftX + padding + boardSize + padding;
	const button1Y = topLeftY + padding;
	const button2Y = middleY - buttonSize/2;
	const button3Y = bottomRightY - padding - buttonSize;

	const button1Rect = Rect(Point(buttonX, button1Y), Point(buttonX+buttonSize, button1Y+buttonSize));
	const button2Rect = Rect(Point(buttonX, button2Y), Point(buttonX+buttonSize, button2Y+buttonSize));
	const button3Rect = Rect(Point(buttonX, button3Y), Point(buttonX+buttonSize, button3Y+buttonSize));

	return {
		windowRect,
		boardRect,
		button1Rect,
		button2Rect,
		button3Rect
	}
}

export function clickedSquare(state: SafeState, location: Point): ChessSquare | null {
	const perspective = teamPerspective(state.self.team);
	const values = getKeyValues(state);

	if (!inside(location, values.boardRect)) {
		return null;
	}

	const cornerPoint = transposePoint(location, values.boardRect.topLeft);
	const row = Math.floor(cornerPoint.y / rensets.generalWindow.squareSize);
	const col = Math.floor(cornerPoint.x / rensets.generalWindow.squareSize);

	const displayClicked = {
		row,
		col
	};
	return unrotateSquare(displayClicked, perspective);
}

export function clickedButton(state: SafeState, location: Point): BriefingName | null {
	const values = getKeyValues(state);

	if (inside(location, values.button1Rect)) {
		return BriefingName.ONE;
	} else if (inside(location, values.button2Rect)) {
		return BriefingName.TWO;
	} else if (inside(location, values.button3Rect)) {
		return BriefingName.THREE;
	}

	return null;
}
