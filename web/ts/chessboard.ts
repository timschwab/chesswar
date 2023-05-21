import { Circle, Point, Rect } from "../../common/data-types/shapes.ts";
import { BriefingName, ChessPiece, ChessSquare, TeamName } from "../../common/data-types/types-base.ts";
import { rensets } from "../../common/settings.ts";
import canvas from "./canvas.ts";
import { SafeState } from "./state.ts";

export function renderBoard(state: SafeState, board: Rect, squareSize: number) {
	// Render all the squares
	for (let row = 0 ; row < 8 ; row++) {
		for (let col = 0 ; col < 8 ; col++) {
			const position = {row, col};
			renderSquare(state, board.topLeft, squareSize, position);
		}
	}

	// Outline the selected ones
	const from = state.general.selectedFrom;
	if (from) {
		const {squareRect} = getSquareValues(board.topLeft, squareSize, from);
		canvas.outlineRect(squareRect, rensets.generalWindow.selection, 2);
	}

	const b1 = state.briefings[BriefingName.ONE];
	const b2 = state.briefings[BriefingName.TWO];
	const b3 = state.briefings[BriefingName.THREE];

	if (b1) {
		const fromRect = getSquareValues(board.topLeft, squareSize, b1.from).squareRect;
		const toRect = getSquareValues(board.topLeft, squareSize, b1.to).squareRect;
		canvas.outlineRect(fromRect, rensets.generalWindow.selection, 2);
		canvas.outlineRect(toRect, rensets.generalWindow.selection, 2);
	}

	if (b2) {
		const fromRect = getSquareValues(board.topLeft, squareSize, b2.from).squareRect;
		const toRect = getSquareValues(board.topLeft, squareSize, b2.to).squareRect;
		canvas.outlineRect(fromRect, rensets.generalWindow.selection, 2);
		canvas.outlineRect(toRect, rensets.generalWindow.selection, 2);
	}

	if (b3) {
		const fromRect = getSquareValues(board.topLeft, squareSize, b3.from).squareRect;
		const toRect = getSquareValues(board.topLeft, squareSize, b3.to).squareRect;
		canvas.outlineRect(fromRect, rensets.generalWindow.selection, 2);
		canvas.outlineRect(toRect, rensets.generalWindow.selection, 2);
	}

	// Outline them
	canvas.outlineRect(board, rensets.generalWindow.boardOutline, 2);
}

export function renderSquare(state: SafeState, topLeft: Point, squareSize: number, position: ChessSquare) {
	const {row, col} = position;
	const {squareRect, color} = getSquareValues(topLeft, squareSize, position);

	canvas.fillRect(squareRect, color);

	const cell = state.self.team == TeamName.ALPHA ? state.teamBoard[7-row][col] : state.teamBoard[row][col];
	if (cell) {
		if (cell.piece == ChessPiece.KING) {
			renderKing(squareRect.topLeft, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.QUEEN) {
			renderQueen(squareRect.topLeft, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.ROOK) {
			renderRook(squareRect.topLeft, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.BISHOP) {
			renderBishop(squareRect.topLeft, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.KNIGHT) {
			renderKnight(squareRect.topLeft, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.PAWN) {
			renderPawn(squareRect.topLeft, squareSize, cell.team);
		}
	}
}

function getSquareValues(topLeft: Point, squareSize: number, position: ChessSquare) {
	const {row, col} = position;
	const genwin = rensets.generalWindow;

	const color = (row+col) % 2 == 0 ? genwin.boardLight : genwin.boardDark;
	const squareTLX = topLeft.x + (col*squareSize);
	const squareTLY = topLeft.y + (row*squareSize);
	const squareTL = Point(squareTLX, squareTLY);
	const squareRect = Rect(squareTL, Point(squareTLX+squareSize, squareTLY+squareSize));
	
	return {
		color,
		squareRect
	};
}

export function renderKing(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.pieceColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const baseTopLeft = Point(middleX-(width*3/8), middleY);
	const baseBottomRight = Point(middleX+(width*3/8), middleY+(width*3/8));
	canvas.fillRect(Rect(baseTopLeft, baseBottomRight), color);

	const crossVerticalTopLeft = Point(middleX-(width/16), middleY-(width*3/8));
	const crossVerticalBottomRight = Point(middleX+(width/16), middleY+(width/8));
	canvas.fillRect(Rect(crossVerticalTopLeft, crossVerticalBottomRight), color);

	const crossHorizontalTopLeft = Point(middleX-(width*3/16), middleY-(width*2/8));
	const crossHorizontalBottomRight = Point(middleX+(width*3/16), middleY-(width*1/8));
	canvas.fillRect(Rect(crossHorizontalTopLeft, crossHorizontalBottomRight), color);
}

export function renderQueen(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.pieceColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const baseTopLeft = Point(middleX-(width*3/8), middleY+(width/12));
	const baseBottomRight = Point(middleX+(width*3/8), middleY+(width*3/8));
	canvas.fillRect(Rect(baseTopLeft, baseBottomRight), color);

	const leftTopLeft = Point(middleX-(width*3/8), middleY-(width*3/16));
	const leftBottomRight = Point(middleX-(width/4), middleY+(width*3/8));
	canvas.fillRect(Rect(leftTopLeft, leftBottomRight), color);
	
	const centerTopLeft = Point(middleX-(width/16), middleY-(width*3/16));
	const centerBottomRight = Point(middleX+(width/16), middleY+(width*3/8));
	canvas.fillRect(Rect(centerTopLeft, centerBottomRight), color);

	const rightTopLeft = Point(middleX+(width/4), middleY-(width*3/16));
	const rightBottomRight = Point(middleX+(width*3/8), middleY+(width*3/8));
	canvas.fillRect(Rect(rightTopLeft, rightBottomRight), color);

	const jewelLeft = Circle(Point(middleX-(width*5/16), middleY-(width/3)), width/16);
	canvas.fillCircle(jewelLeft, color);

	const jewelCenter = Circle(Point(middleX, middleY-(width/3)), width/16);
	canvas.fillCircle(jewelCenter, color);

	const jewelRight = Circle(Point(middleX+(width*5/16), middleY-(width/3)), width/16);
	canvas.fillCircle(jewelRight, color);
}

export function renderRook(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.pieceColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const baseTopLeft = Point(middleX-(width/3), middleY-(width/4));
	const baseBottomRight = Point(middleX+(width/3), middleY+(width/3));
	canvas.fillRect(Rect(baseTopLeft, baseBottomRight), color);
	
	const leftTopLeft = Point(middleX-(width/3), middleY-(width*3/8));
	const leftBottomRight = Point(middleX-(width/6), middleY-(width/12));
	canvas.fillRect(Rect(leftTopLeft, leftBottomRight), color);
	
	const centerTopLeft = Point(middleX-(width/12), middleY-(width*3/8));
	const centerBottomRight = Point(middleX+(width/12), middleY-(width/12));
	canvas.fillRect(Rect(centerTopLeft, centerBottomRight), color);

	const rightTopLeft = Point(middleX+(width/6), middleY-(width*3/8));
	const rightBottomRight = Point(middleX+(width/3), middleY-(width/12));
	canvas.fillRect(Rect(rightTopLeft, rightBottomRight), color);
}

export function renderBishop(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.pieceColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const body = Circle(Point(middleX, middleY), width*(3/16));
	canvas.fillCircle(body, color);

	const hat = Circle(Point(middleX, middleY - (width/4)), width/16);
	canvas.fillCircle(hat, color);

	const baseTopLeft = Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = Point(middleX+(width/3), middleY+(width/3));
	canvas.fillRect(Rect(baseTopLeft, baseBottomRight), color);
}

export function renderKnight(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.pieceColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);
	
	const baseTopLeft = Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = Point(middleX+(width/3), middleY+(width/3));
	canvas.fillRect(Rect(baseTopLeft, baseBottomRight), color);

	const bodyTopLeft = Point(middleX-(width/3), middleY-(width/3));
	const bodyBottomRight = Point(middleX-(width/8), middleY+(width/3));
	canvas.fillRect(Rect(bodyTopLeft, bodyBottomRight), color);

	const neckTopLeft = Point(middleX-(width/3), middleY-(width/3));
	const neckBottomRight = Point(middleX+(width/3), middleY-(width/8));
	canvas.fillRect(Rect(neckTopLeft, neckBottomRight), color);

	const noseTopLeft = Point(middleX+(width/8), middleY-(width/3));
	const noseBottomRight = Point(middleX+(width/3), middleY);
	canvas.fillRect(Rect(noseTopLeft, noseBottomRight), color);

	const ear = Circle(Point(middleX-(width/12), middleY-(width/3)), width/12);
	canvas.fillCircle(ear, color);
}

export function renderPawn(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.pieceColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const topCircle = Circle(Point(middleX, middleY - (width/6)), width/8);
	canvas.fillCircle(topCircle, color);

	const stemTopLeft = Point(middleX-(width/16), middleY - (width/6));
	const stemBottomRight = Point(middleX+(width/16), middleY + (width/4));
	canvas.fillRect(Rect(stemTopLeft, stemBottomRight), color);

	const baseTopLeft = Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = Point(middleX+(width/3), middleY+(width/3));
	canvas.fillRect(Rect(baseTopLeft, baseBottomRight), color);
}