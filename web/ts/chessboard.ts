import { Circle, Point, Rect } from "../../common/data-types/shapes.ts";
import { TeamName } from "../../common/data-types/base.ts";
import { rensets } from "../../common/settings.ts";
import canvas from "./canvas.ts";
import { ChessBoard, ChessMove, ChessPiece, ChessSquare } from "../../common/data-types/chess.ts";
import { Color } from "../../common/colors.ts";

export function renderBoard(boardRect: Rect, board: ChessBoard, teamMoves: ChessMove[], enemyMoves: ChessMove[]) {
	const squareSize = boardRect.width/8;

	// Render all the squares
	for (let row = 0 ; row < 8 ; row++) {
		for (let col = 0 ; col < 8 ; col++) {
			const position = {row, col};
			renderSquare(board, boardRect.topLeft, squareSize, position);
		}
	}

	for (const move of enemyMoves) {
		renderMove(boardRect, squareSize, move, rensets.generalWindow.enemyMove);
	}
	for (const move of teamMoves) {
		renderMove(boardRect, squareSize, move, rensets.generalWindow.teamMove);
	}

	// Outline them
	canvas.outlineRect(boardRect, rensets.generalWindow.boardOutline, 2);
}

function renderMove(boardRect: Rect, squareSize: number, move: ChessMove, color: Color) {
	const fromRect = getSquareValues(boardRect.topLeft, squareSize, move.from).squareRect;
	const toRect = getSquareValues(boardRect.topLeft, squareSize, move.to).squareRect;
	canvas.outlineRect(fromRect, color, 2);
	canvas.outlineRect(toRect, color, 2);
	canvas.arrow(fromRect.center, toRect.center, color, 2);
}

function renderSquare(board: ChessBoard, topLeft: Point, squareSize: number, position: ChessSquare) {
	const {row, col} = position;
	const {squareRect, color} = getSquareValues(topLeft, squareSize, position);

	canvas.fillRect(squareRect, color);

	const cell = board[row][col];
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

function renderKing(topLeft: Point, width: number, team: TeamName) {
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

function renderQueen(topLeft: Point, width: number, team: TeamName) {
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

function renderRook(topLeft: Point, width: number, team: TeamName) {
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

function renderBishop(topLeft: Point, width: number, team: TeamName) {
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

function renderKnight(topLeft: Point, width: number, team: TeamName) {
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

function renderPawn(topLeft: Point, width: number, team: TeamName) {
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
