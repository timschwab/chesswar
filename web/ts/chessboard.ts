import { TeamName } from "../../common/data-types/base.ts";
import { rensets } from "../../common/settings.ts";
import { ChessBoard, ChessMove, ChessPerspective, ChessPiece, ChessSquare } from "../../common/data-types/chess.ts";
import canvas from "./canvas/canvas.ts";
import { Rect } from "../../common/shapes/Rect.ts";
import { Point } from "../../common/shapes/Point.ts";
import { Circle } from "../../common/shapes/Circle.ts";

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
	if (perspective == ChessPerspective.NORTH) {
		return rotateSquare(square, ChessPerspective.NORTH);
	} else if (perspective == ChessPerspective.EAST) {
		return rotateSquare(square, ChessPerspective.WEST);
	} else if (perspective == ChessPerspective.SOUTH) {
		return rotateSquare(square, ChessPerspective.SOUTH);
	} else if (perspective == ChessPerspective.WEST) {
		return rotateSquare(square, ChessPerspective.EAST);
	}

	throw "Can't get here";
}

export function renderBoard(boardRect: Rect, board: ChessBoard, moves: ChessMove[], perspective: ChessPerspective) {
	const squareSize = boardRect.width/8;

	// Render all the squares
	for (let row = 0 ; row < 8 ; row++) {
		for (let col = 0 ; col < 8 ; col++) {
			const position = {row, col};
			renderSquare(board, boardRect.leftTop, squareSize, position, perspective);
		}
	}

	for (const move of moves) {
		renderMove(boardRect, squareSize, move, perspective);
	}

	// Outline them
	canvas.UI.outlineRect(boardRect, rensets.generalWindow.boardOutline, 2);
}

function renderMove(boardRect: Rect, squareSize: number, move: ChessMove, perspective: ChessPerspective) {
	const color = rensets.generalWindow.teamColor[move.team];

	const displayFrom = rotateSquare(move.from, perspective);
	const displayTo = rotateSquare(move.to, perspective);

	const fromRect = getSquareValues(boardRect.leftTop, squareSize, displayFrom).squareRect;
	const toRect = getSquareValues(boardRect.leftTop, squareSize, displayTo).squareRect;
	canvas.UI.outlineRect(fromRect, color, 2);
	canvas.UI.outlineRect(toRect, color, 2);
	canvas.UI.arrow(fromRect.center, toRect.center, color, 2);
}

function renderSquare(board: ChessBoard, leftTop: Point, squareSize: number, position: ChessSquare, perspective: ChessPerspective) {
	const {row, col} = position;
	const displayPosition = rotateSquare(position, perspective);
	const {squareRect, color} = getSquareValues(leftTop, squareSize, displayPosition);

	canvas.UI.fillRect(squareRect, color);

	const cell = board[row][col];
	if (cell) {
		if (cell.piece == ChessPiece.KING) {
			renderKing(squareRect.leftTop, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.QUEEN) {
			renderQueen(squareRect.leftTop, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.ROOK) {
			renderRook(squareRect.leftTop, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.BISHOP) {
			renderBishop(squareRect.leftTop, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.KNIGHT) {
			renderKnight(squareRect.leftTop, squareSize, cell.team);
		} else if (cell.piece == ChessPiece.PAWN) {
			renderPawn(squareRect.leftTop, squareSize, cell.team);
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

function renderKing(leftTop: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const leftTopX = leftTop.x;
	const leftTopY = leftTop.y;

	const middleX = leftTopX+(width/2);
	const middleY = leftTopY+(width/2);

	const baseTopLeft = new Point(middleX-(width*3/8), middleY);
	const baseBottomRight = new Point(middleX+(width*3/8), middleY+(width*3/8));
	canvas.UI.fillRect(new Rect(baseTopLeft, baseBottomRight), color);

	const crossVerticalTopLeft = new Point(middleX-(width/16), middleY-(width*3/8));
	const crossVerticalBottomRight = new Point(middleX+(width/16), middleY+(width/8));
	canvas.UI.fillRect(new Rect(crossVerticalTopLeft, crossVerticalBottomRight), color);

	const crossHorizontalTopLeft = new Point(middleX-(width*3/16), middleY-(width*2/8));
	const crossHorizontalBottomRight = new Point(middleX+(width*3/16), middleY-(width*1/8));
	canvas.UI.fillRect(new Rect(crossHorizontalTopLeft, crossHorizontalBottomRight), color);
}

function renderQueen(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const baseTopLeft = new Point(middleX-(width*3/8), middleY+(width/12));
	const baseBottomRight = new Point(middleX+(width*3/8), middleY+(width*3/8));
	canvas.UI.fillRect(new Rect(baseTopLeft, baseBottomRight), color);

	const leftTopLeft = new Point(middleX-(width*3/8), middleY-(width*3/16));
	const leftBottomRight = new Point(middleX-(width/4), middleY+(width*3/8));
	canvas.UI.fillRect(new Rect(leftTopLeft, leftBottomRight), color);
	
	const centerTopLeft = new Point(middleX-(width/16), middleY-(width*3/16));
	const centerBottomRight = new Point(middleX+(width/16), middleY+(width*3/8));
	canvas.UI.fillRect(new Rect(centerTopLeft, centerBottomRight), color);

	const rightTopLeft = new Point(middleX+(width/4), middleY-(width*3/16));
	const rightBottomRight = new Point(middleX+(width*3/8), middleY+(width*3/8));
	canvas.UI.fillRect(new Rect(rightTopLeft, rightBottomRight), color);

	const jewelLeft = new Circle(new Point(middleX-(width*5/16), middleY-(width/3)), width/16);
	canvas.UI.fillCircle(jewelLeft, color);

	const jewelCenter = new Circle(new Point(middleX, middleY-(width/3)), width/16);
	canvas.UI.fillCircle(jewelCenter, color);

	const jewelRight = new Circle(new Point(middleX+(width*5/16), middleY-(width/3)), width/16);
	canvas.UI.fillCircle(jewelRight, color);
}

function renderRook(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const baseTopLeft = new Point(middleX-(width/3), middleY-(width/4));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	canvas.UI.fillRect(new Rect(baseTopLeft, baseBottomRight), color);
	
	const leftTopLeft = new Point(middleX-(width/3), middleY-(width*3/8));
	const leftBottomRight = new Point(middleX-(width/6), middleY-(width/12));
	canvas.UI.fillRect(new Rect(leftTopLeft, leftBottomRight), color);
	
	const centerTopLeft = new Point(middleX-(width/12), middleY-(width*3/8));
	const centerBottomRight = new Point(middleX+(width/12), middleY-(width/12));
	canvas.UI.fillRect(new Rect(centerTopLeft, centerBottomRight), color);

	const rightTopLeft = new Point(middleX+(width/6), middleY-(width*3/8));
	const rightBottomRight = new Point(middleX+(width/3), middleY-(width/12));
	canvas.UI.fillRect(new Rect(rightTopLeft, rightBottomRight), color);
}

function renderBishop(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const body = new Circle(new Point(middleX, middleY), width*(3/16));
	canvas.UI.fillCircle(body, color);

	const hat = new Circle(new Point(middleX, middleY - (width/4)), width/16);
	canvas.UI.fillCircle(hat, color);

	const baseTopLeft = new Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	canvas.UI.fillRect(new Rect(baseTopLeft, baseBottomRight), color);
}

function renderKnight(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);
	
	const baseTopLeft = new Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	canvas.UI.fillRect(new Rect(baseTopLeft, baseBottomRight), color);

	const bodyTopLeft = new Point(middleX-(width/3), middleY-(width/3));
	const bodyBottomRight = new Point(middleX-(width/8), middleY+(width/3));
	canvas.UI.fillRect(new Rect(bodyTopLeft, bodyBottomRight), color);

	const neckTopLeft = new Point(middleX-(width/3), middleY-(width/3));
	const neckBottomRight = new Point(middleX+(width/3), middleY-(width/8));
	canvas.UI.fillRect(new Rect(neckTopLeft, neckBottomRight), color);

	const noseTopLeft = new Point(middleX+(width/8), middleY-(width/3));
	const noseBottomRight = new Point(middleX+(width/3), middleY);
	canvas.UI.fillRect(new Rect(noseTopLeft, noseBottomRight), color);

	const ear = new Circle(new Point(middleX-(width/12), middleY-(width/3)), width/12);
	canvas.UI.fillCircle(ear, color);
}

function renderPawn(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.generalWindow.teamColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const topCircle = new Circle(new Point(middleX, middleY - (width/6)), width/8);
	canvas.UI.fillCircle(topCircle, color);

	const stemTopLeft = new Point(middleX-(width/16), middleY - (width/6));
	const stemBottomRight = new Point(middleX+(width/16), middleY + (width/4));
	canvas.UI.fillRect(new Rect(stemTopLeft, stemBottomRight), color);

	const baseTopLeft = new Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	canvas.UI.fillRect(new Rect(baseTopLeft, baseBottomRight), color);
}
