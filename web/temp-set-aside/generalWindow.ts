import { teamPerspective, unrotateSquare } from "./chessboard.ts";
import { SafeState } from "./state.ts";
import { ChessSquare } from "../../common/data-types/chess.ts";
import { rensets } from "../../common/settings.ts";
import { BriefingName } from "../../common/data-types/facility.ts";
import { CWCanvas } from "./canvas/CWCanvas.ts";
import { Rect } from "../../common/shapes/Rect.ts";
import { Point } from "../../common/shapes/Point.ts";

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
	// renderBoard(values.boardRect, state.teamBoard.value(), moves as ChessMove[], perspective);

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

	const windowRect = new Rect(new Point(topLeftX, topLeftY), new Point(bottomRightX, bottomRightY));

	const boardTopLeftX = topLeftX + padding;
	const boardTopLeftY = topLeftY + padding;
	const boardRect = new Rect(new Point(boardTopLeftX, boardTopLeftY), new Point(topLeftX+boardSize+padding, topLeftY+boardSize+padding));

	const buttonX = topLeftX + padding + boardSize + padding;
	const button1Y = topLeftY + padding;
	const button2Y = middleY - buttonSize/2;
	const button3Y = bottomRightY - padding - buttonSize;

	const button1Rect = new Rect(new Point(buttonX, button1Y), new Point(buttonX+buttonSize, button1Y+buttonSize));
	const button2Rect = new Rect(new Point(buttonX, button2Y), new Point(buttonX+buttonSize, button2Y+buttonSize));
	const button3Rect = new Rect(new Point(buttonX, button3Y), new Point(buttonX+buttonSize, button3Y+buttonSize));

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

	if (!location.inside(values.boardRect)) {
		return null;
	}

	const cornerPoint = location.add(values.boardRect.leftTop);
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

	if (location.inside(values.button1Rect)) {
		return BriefingName.ONE;
	} else if (location.inside(values.button2Rect)) {
		return BriefingName.TWO;
	} else if (location.inside(values.button3Rect)) {
		return BriefingName.THREE;
	}

	return null;
}
