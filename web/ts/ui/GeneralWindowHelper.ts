import { PlayerRole } from "../../../common/data-types/base.ts";
import { ChessSquare } from "../../../common/data-types/chess.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { ClientMessageTypes } from "../../../common/message-types/client.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { screenValue } from "../core/screen.ts";
import { socketSend } from "../core/socket.ts";
import { ClientPlayer } from "../game-logic/ClientPlayer.ts";
import { state } from "../game-logic/state.ts";
import { teamPerspective, unrotateSquare } from "./ChessboardHelper.ts";

interface ImportantValuesBundle {
	windowRect: Rect,
	boardRect: Rect,
	button1Rect: Rect,
	button2Rect: Rect,
	button3Rect: Rect
}

export function handleClick(location: Point) {
	if (state.selfPlayer == null) {
		return;
	}

	const role = state.selfPlayer.role;
	if (role != PlayerRole.GENERAL) {
		return;
	}

	const importantValues = getImportantValues(screenValue);
	const button = clickedButton(importantValues, location);
	const square = clickedSquare(state.selfPlayer, importantValues, location);

	if (button != null) {
		state.general.selectedButton = button;
		state.general.selectedFrom = null;
	} else if (state.general.selectedButton != null && square != null) {
		if (state.general.selectedFrom) {
			// Send orders
			const payload = {
				briefing: state.general.selectedButton,
				move: {
					team: state.selfPlayer.team,
					from: state.general.selectedFrom,
					to: square
				}
			};

			socketSend({
				type: ClientMessageTypes.GENERAL_ORDERS,
				payload
			});

			// Clear state
			state.general.selectedButton = null;
			state.general.selectedFrom = null;
		} else {
			state.general.selectedFrom = square;
		}
	}
}

export function getImportantValues(screen: Rect): ImportantValuesBundle {
	const genwin = rensets.generalWindow;

	const padding = genwin.padding;
	const squareSize = genwin.squareSize;
	const buttonSize = genwin.buttonSize;

	const boardSize = squareSize*8;
	const windowWidth = padding + boardSize + padding + buttonSize + padding;
	const windowHeight = padding + boardSize + padding;

	const middleX = screen.width/2;
	const middleY = screen.height/2;

	const topLeftX = middleX - windowWidth/2;
	const topLeftY = middleY - windowHeight/2;
	const bottomRightX = middleX + windowWidth/2;
	const bottomRightY = middleY + windowHeight/2;

	const windowRectRaw = new Rect(new Point(topLeftX, topLeftY), new Point(bottomRightX, bottomRightY));
	const windowRect = windowRectRaw.floor();

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

function clickedButton(importantValues: ImportantValuesBundle, location: Point): BriefingName | null {
	if (location.inside(importantValues.button1Rect)) {
		return BriefingName.ONE;
	} else if (location.inside(importantValues.button2Rect)) {
		return BriefingName.TWO;
	} else if (location.inside(importantValues.button3Rect)) {
		return BriefingName.THREE;
	}

	return null;
}

function clickedSquare(selfPlayer: ClientPlayer, importantValues: ImportantValuesBundle, location: Point): ChessSquare | null {
	const perspective = teamPerspective(selfPlayer.team);

	if (!location.inside(importantValues.boardRect)) {
		return null;
	}

	const cornerPoint = location.subtract(importantValues.boardRect.leftTop);
	const row = Math.floor(cornerPoint.y / rensets.generalWindow.squareSize);
	const col = Math.floor(cornerPoint.x / rensets.generalWindow.squareSize);

	const displayClicked = {
		row,
		col
	};

	return unrotateSquare(displayClicked, perspective);
}
