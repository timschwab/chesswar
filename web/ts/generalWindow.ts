import { Point, Rect } from "../../common/data-types/shapes.ts";
import { ChessSquare } from "../../common/data-types/types-base.ts";
import { rensets } from "../../common/settings.ts";
import { inside } from "../../common/shape-logic/inside.ts";
import { transposePoint } from "../../common/shape-logic/transpose.ts";
import canvas from "./canvas.ts";
import { renderBoard } from "./chessboard.ts";
import { SafeState } from "./state.ts";

export function renderGeneralWindow(state: SafeState): void {
	const values = getKeyValues(state);
	const genwin = rensets.generalWindow;

	// Draw window
	canvas.fillRect(values.windowRect, genwin.windowInside);
	canvas.outlineRect(values.windowRect, genwin.windowOutline, 5);

	// Draw chessboard squares
	renderBoard(state, values.boardRect, genwin.squareSize);

	// Draw buttons
	canvas.fillRect(values.button1Rect, genwin.button);
	canvas.fillRect(values.button2Rect, genwin.button);
	canvas.fillRect(values.button3Rect, genwin.button);

	// Draw selected button
	if (state.general.selectedButton == "one") {
		canvas.outlineRect(values.button1Rect, genwin.selection, 3);
	} else if (state.general.selectedButton == "two") {
		canvas.outlineRect(values.button2Rect, genwin.selection, 3);
	} else if (state.general.selectedButton == "three") {
		canvas.outlineRect(values.button3Rect, genwin.selection, 3);
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
	const values = getKeyValues(state);

	if (!inside(location, values.boardRect)) {
		return null;
	}

	const cornerPoint = transposePoint(location, values.boardRect.topLeft);
	const row = Math.floor(cornerPoint.y / rensets.generalWindow.squareSize);
	const col = Math.floor(cornerPoint.x / rensets.generalWindow.squareSize);

	return {
		row,
		col
	};
}

export function clickedButton(state: SafeState, location: Point): "one" | "two" | "three" | null {
	const values = getKeyValues(state);

	if (inside(location, values.button1Rect)) {
		return "one";
	} else if (inside(location, values.button2Rect)) {
		return "two";
	} else if (inside(location, values.button3Rect)) {
		return "three";
	}

	return null;
}
