import { TeamName } from "../../../common/data-types/base.ts";
import { ChessBoard, ChessMove, ChessPerspective, ChessPiece, ChessSquare } from "../../../common/data-types/chess.ts";
import { rensets } from "../../../common/settings.ts";
import { Circle } from "../../../common/shapes/Circle.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export function teamPerspective(team: TeamName): ChessPerspective {
	if (team == TeamName.BLUE) {
		return ChessPerspective.SOUTH;
	} else if (team == TeamName.RED) {
		return ChessPerspective.NORTH
	}

	throw "Can never get here";
}

export function rotateSquare(square: ChessSquare, perspective: ChessPerspective): ChessSquare {
	let result = square;

	// Turn 90 degress
	if (perspective == ChessPerspective.WEST || perspective == ChessPerspective.EAST) {
		result = {
			row: result.col,
			col: 7-result.row
		};
	}

	// Turn 180 degres
	if (perspective == ChessPerspective.SOUTH || perspective == ChessPerspective.WEST) {
		result = {
			row: 7-result.row,
			col: 7-result.col
		};
	}

	return result;
}

export function unrotateSquare(square: ChessSquare, perspective: ChessPerspective): ChessSquare {
	const opposites = {
		[ChessPerspective.NORTH]: ChessPerspective.NORTH,
		[ChessPerspective.EAST]: ChessPerspective.WEST,
		[ChessPerspective.SOUTH]: ChessPerspective.SOUTH,
		[ChessPerspective.WEST]: ChessPerspective.EAST
	};
	const opposite = opposites[perspective];
	return rotateSquare(square, opposite);
}

export function renderBoard(cwCanvas: CWCanvas, boardRect: Rect, board: ChessBoard, moves: ChessMove[], perspective: ChessPerspective) {
	const squareSize = boardRect.width/8;

	// Render all the squares
	for (let row = 0 ; row < 8 ; row++) {
		for (let col = 0 ; col < 8 ; col++) {
			const position = {row, col};
			renderSquare(cwCanvas, board, boardRect.leftTop, squareSize, position, perspective);
		}
	}

	for (const move of moves) {
		renderMove(cwCanvas, boardRect, squareSize, move, perspective);
	}

	// Outline them
	cwCanvas.outlineRect(new Shape(boardRect, rensets.generalWindow.boardOutline), 2);
}

function renderMove(cwCanvas: CWCanvas, boardRect: Rect, squareSize: number, move: ChessMove, perspective: ChessPerspective) {
	const color = rensets.generalWindow.teamColor[move.team];

	const displayFrom = rotateSquare(move.from, perspective);
	const displayTo = rotateSquare(move.to, perspective);

	const fromRect = getSquareValues(boardRect.leftTop, squareSize, displayFrom).squareRect;
	const toRect = getSquareValues(boardRect.leftTop, squareSize, displayTo).squareRect;

	cwCanvas.outlineRect(new Shape(fromRect, color), 2);
	cwCanvas.outlineRect(new Shape(toRect, color), 2);
	cwCanvas.arrow(fromRect.center, toRect.center, color, 2);
}

function renderSquare(cwCanvas: CWCanvas, board: ChessBoard, leftTop: Point, squareSize: number, position: ChessSquare, perspective: ChessPerspective) {
	const {row, col} = position;
	const displayPosition = rotateSquare(position, perspective);
	const {squareRect, color} = getSquareValues(leftTop, squareSize, displayPosition);

	cwCanvas.fillRect(new Shape(squareRect, color));

	const cell = board[row][col];
	if (cell) {
		if (cell.piece == ChessPiece.KING) {
			renderKing(cwCanvas, squareRect.leftTop, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.QUEEN) {
			renderQueen(cwCanvas, squareRect.leftTop, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.ROOK) {
			renderRook(cwCanvas, squareRect.leftTop, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.BISHOP) {
			renderBishop(cwCanvas, squareRect.leftTop, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.KNIGHT) {
			renderKnight(cwCanvas, squareRect.leftTop, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.PAWN) {
			renderPawn(cwCanvas, squareRect.leftTop, squareSize, cell.team);
		}
	}
}

function getSquareValues(leftTop: Point, squareSize: number, position: ChessSquare) {
	const {row, col} = position;
	const genwin = rensets.generalWindow;

	const color = (row+col) % 2 == 0 ? genwin.boardLight : genwin.boardDark;
	const squareTLX = leftTop.x + (col*squareSize);
	const squareTLY = leftTop.y + (row*squareSize);
	const squareTL = new Point(squareTLX, squareTLY);
	const squareRect = new Rect(squareTL, new Point(squareTLX+squareSize, squareTLY+squareSize));
	
	return {
		color,
		squareRect
	};
}

function renderKing(cwCanvas: CWCanvas, leftTop: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const leftTopX = leftTop.x;
	const leftTopY = leftTop.y;

	const middleX = leftTopX+(width/2);
	const middleY = leftTopY+(width/2);

	const baseTopLeft = new Point(middleX-(width*3/8), middleY);
	const baseBottomRight = new Point(middleX+(width*3/8), middleY+(width*3/8));
	cwCanvas.fillRect(new Shape(new Rect(baseTopLeft, baseBottomRight), color));

	const crossVerticalTopLeft = new Point(middleX-(width/16), middleY-(width*3/8));
	const crossVerticalBottomRight = new Point(middleX+(width/16), middleY+(width/8));
	cwCanvas.fillRect(new Shape(new Rect(crossVerticalTopLeft, crossVerticalBottomRight), color));

	const crossHorizontalTopLeft = new Point(middleX-(width*3/16), middleY-(width*2/8));
	const crossHorizontalBottomRight = new Point(middleX+(width*3/16), middleY-(width*1/8));
	cwCanvas.fillRect(new Shape(new Rect(crossHorizontalTopLeft, crossHorizontalBottomRight), color));
}

function renderQueen(cwCanvas: CWCanvas, topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const baseTopLeft = new Point(middleX-(width*3/8), middleY+(width/12));
	const baseBottomRight = new Point(middleX+(width*3/8), middleY+(width*3/8));
	cwCanvas.fillRect(new Shape(new Rect(baseTopLeft, baseBottomRight), color));

	const leftTopLeft = new Point(middleX-(width*3/8), middleY-(width*3/16));
	const leftBottomRight = new Point(middleX-(width/4), middleY+(width*3/8));
	cwCanvas.fillRect(new Shape(new Rect(leftTopLeft, leftBottomRight), color));
	
	const centerTopLeft = new Point(middleX-(width/16), middleY-(width*3/16));
	const centerBottomRight = new Point(middleX+(width/16), middleY+(width*3/8));
	cwCanvas.fillRect(new Shape(new Rect(centerTopLeft, centerBottomRight), color));

	const rightTopLeft = new Point(middleX+(width/4), middleY-(width*3/16));
	const rightBottomRight = new Point(middleX+(width*3/8), middleY+(width*3/8));
	cwCanvas.fillRect(new Shape(new Rect(rightTopLeft, rightBottomRight), color));

	const jewelLeft = new Circle(new Point(middleX-(width*5/16), middleY-(width/3)), width/16);
	cwCanvas.fillCircle(new Shape(jewelLeft, color));

	const jewelCenter = new Circle(new Point(middleX, middleY-(width/3)), width/16);
	cwCanvas.fillCircle(new Shape(jewelCenter, color));

	const jewelRight = new Circle(new Point(middleX+(width*5/16), middleY-(width/3)), width/16);
	cwCanvas.fillCircle(new Shape(jewelRight, color));
}

function renderRook(cwCanvas: CWCanvas, topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const baseTopLeft = new Point(middleX-(width/3), middleY-(width/4));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	cwCanvas.fillRect(new Shape(new Rect(baseTopLeft, baseBottomRight), color));
	
	const leftTopLeft = new Point(middleX-(width/3), middleY-(width*3/8));
	const leftBottomRight = new Point(middleX-(width/6), middleY-(width/12));
	cwCanvas.fillRect(new Shape(new Rect(leftTopLeft, leftBottomRight), color));
	
	const centerTopLeft = new Point(middleX-(width/12), middleY-(width*3/8));
	const centerBottomRight = new Point(middleX+(width/12), middleY-(width/12));
	cwCanvas.fillRect(new Shape(new Rect(centerTopLeft, centerBottomRight), color));

	const rightTopLeft = new Point(middleX+(width/6), middleY-(width*3/8));
	const rightBottomRight = new Point(middleX+(width/3), middleY-(width/12));
	cwCanvas.fillRect(new Shape(new Rect(rightTopLeft, rightBottomRight), color));
}

function renderBishop(cwCanvas: CWCanvas, topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const body = new Circle(new Point(middleX, middleY), width*(3/16));
	cwCanvas.fillCircle(new Shape(body, color));

	const hat = new Circle(new Point(middleX, middleY - (width/4)), width/16);
	cwCanvas.fillCircle(new Shape(hat, color));

	const baseTopLeft = new Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	cwCanvas.fillRect(new Shape(new Rect(baseTopLeft, baseBottomRight), color));
}

function renderKnight(cwCanvas: CWCanvas, topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);
	
	const baseTopLeft = new Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	cwCanvas.fillRect(new Shape(new Rect(baseTopLeft, baseBottomRight), color));

	const bodyTopLeft = new Point(middleX-(width/3), middleY-(width/3));
	const bodyBottomRight = new Point(middleX-(width/8), middleY+(width/3));
	cwCanvas.fillRect(new Shape(new Rect(bodyTopLeft, bodyBottomRight), color));

	const neckTopLeft = new Point(middleX-(width/3), middleY-(width/3));
	const neckBottomRight = new Point(middleX+(width/3), middleY-(width/8));
	cwCanvas.fillRect(new Shape(new Rect(neckTopLeft, neckBottomRight), color));

	const noseTopLeft = new Point(middleX+(width/8), middleY-(width/3));
	const noseBottomRight = new Point(middleX+(width/3), middleY);
	cwCanvas.fillRect(new Shape(new Rect(noseTopLeft, noseBottomRight), color));

	const ear = new Circle(new Point(middleX-(width/12), middleY-(width/3)), width/12);
	cwCanvas.fillCircle(new Shape(ear, color));
}

function renderPawn(cwCanvas: CWCanvas, topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const topCircle = new Circle(new Point(middleX, middleY - (width/6)), width/8);
	cwCanvas.fillCircle(new Shape(topCircle, color));

	const stemTopLeft = new Point(middleX-(width/16), middleY - (width/6));
	const stemBottomRight = new Point(middleX+(width/16), middleY + (width/4));
	cwCanvas.fillRect(new Shape(new Rect(stemTopLeft, stemBottomRight), color));

	const baseTopLeft = new Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	cwCanvas.fillRect(new Shape(new Rect(baseTopLeft, baseBottomRight), color));
}
