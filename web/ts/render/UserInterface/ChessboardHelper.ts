import { TeamName } from "../../../../common/data-types/base.ts";
import { ChessPerspective, ChessSquare, ChessBoard, ChessMove, ChessPiece } from "../../../../common/data-types/chess.ts";
import { assertNever } from "../../../../common/Preconditions.ts";
import { rensets } from "../../../../common/settings.ts";
import { Circle } from "../../../../common/shapes/Circle.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { Triangle } from "../../../../common/shapes/Triangle.ts";

export function teamPerspective(team: TeamName): ChessPerspective {
	if (team == TeamName.BLUE) {
		return ChessPerspective.SOUTH;
	} else if (team == TeamName.RED) {
		return ChessPerspective.NORTH
	} else {
		assertNever(team);
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

export function renderBoard(boardRect: Rect, boardData: ChessBoard, moves: ChessMove[], perspective: ChessPerspective): Structure[] {
	const squareSize = boardRect.width/8;
	const allStructures: Structure[] = [];

	// Outline the board
	allStructures.push(Shape.from(boardRect.expand(2), rensets.generalWindow.boardOutline).toStructure());

	// Render all the squares
	for (let row = 0 ; row < 8 ; row++) {
		for (let col = 0 ; col < 8 ; col++) {
			const position = {row, col};
			allStructures.push(...renderSquare(boardData, boardRect.leftTop, squareSize, position, perspective));
		}
	}

	// Render all the moves
	for (const move of moves) {
		//allStructures.push(...renderMove(boardRect, squareSize, move, perspective));
	}

	return allStructures;
}

function renderSquare(board: ChessBoard, leftTop: Point, squareSize: number, position: ChessSquare, perspective: ChessPerspective): Structure[] {
	const displayPosition = rotateSquare(position, perspective);
	const {squareRect, color} = getSquareValues(leftTop, squareSize, displayPosition);

	const squareStructure = Shape.from(squareRect, color).toStructure();

	let pieceStructure: Structure | null = null;
	const cell = board[position.row][position.col];
	if (cell !== null) {
		const pieceTriangles = renderChessPiece(cell.piece, squareRect.leftTop, squareSize);
		pieceStructure = new Structure(pieceTriangles, rensets.generalWindow.teamColor[cell.team]);
	}

	if (pieceStructure === null) {
		return [squareStructure];
	} else {
		return [squareStructure, pieceStructure];
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

function renderChessPiece(piece: ChessPiece, leftTop: Point, squareSize: number): Triangle[] {
	switch (piece) {
		case ChessPiece.KING:
			return renderKing(leftTop, squareSize);
		case ChessPiece.QUEEN:
			return renderQueen(leftTop, squareSize);
		case ChessPiece.ROOK:
			return renderRook(leftTop, squareSize);
		case ChessPiece.BISHOP:
			return renderBishop(leftTop, squareSize);
		case ChessPiece.KNIGHT:
			return renderKnight(leftTop, squareSize);
		case ChessPiece.PAWN:
			return renderPawn(leftTop, squareSize);
		default:
			assertNever(piece);
	}

	throw "Can't get here";
}

// These should be completely redone with just triangles

function renderKing(leftTop: Point, width: number): Triangle[] {
	const leftTopX = leftTop.x;
	const leftTopY = leftTop.y;

	const middleX = leftTopX+(width/2);
	const middleY = leftTopY+(width/2);

	const baseTopLeft = new Point(middleX-(width*3/8), middleY);
	const baseBottomRight = new Point(middleX+(width*3/8), middleY+(width*3/8));
	const base = new Rect(baseTopLeft, baseBottomRight);

	const crossVerticalTopLeft = new Point(middleX-(width/16), middleY-(width*3/8));
	const crossVerticalBottomRight = new Point(middleX+(width/16), middleY+(width/8));
	const crossVertical = new Rect(crossVerticalTopLeft, crossVerticalBottomRight);

	const crossHorizontalTopLeft = new Point(middleX-(width*3/16), middleY-(width*2/8));
	const crossHorizontalBottomRight = new Point(middleX+(width*3/16), middleY-(width*1/8));
	const crossHorizontal = new Rect(crossHorizontalTopLeft, crossHorizontalBottomRight);

	return [
		base.toTriangles(),
		crossVertical.toTriangles(),
		crossHorizontal.toTriangles()
	].flat();
}

function renderQueen(topLeft: Point, width: number): Triangle[] {
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const baseTopLeft = new Point(middleX-(width*3/8), middleY+(width/12));
	const baseBottomRight = new Point(middleX+(width*3/8), middleY+(width*3/8));
	const base = new Rect(baseTopLeft, baseBottomRight);

	const leftTopLeft = new Point(middleX-(width*3/8), middleY-(width*3/16));
	const leftBottomRight = new Point(middleX-(width/4), middleY+(width*3/8));
	const left = new Rect(leftTopLeft, leftBottomRight);
	
	const centerTopLeft = new Point(middleX-(width/16), middleY-(width*3/16));
	const centerBottomRight = new Point(middleX+(width/16), middleY+(width*3/8));
	const center = new Rect(centerTopLeft, centerBottomRight);

	const rightTopLeft = new Point(middleX+(width/4), middleY-(width*3/16));
	const rightBottomRight = new Point(middleX+(width*3/8), middleY+(width*3/8));
	const right = new Rect(rightTopLeft, rightBottomRight);

	const jewelLeft = new Circle(new Point(middleX-(width*5/16), middleY-(width/3)), width/16);
	const jewelCenter = new Circle(new Point(middleX, middleY-(width/3)), width/16);
	const jewelRight = new Circle(new Point(middleX+(width*5/16), middleY-(width/3)), width/16);

	return [
		base.toTriangles(),
		left.toTriangles(),
		center.toTriangles(),
		right.toTriangles(),
		jewelLeft.toTriangles(),
		jewelCenter.toTriangles(),
		jewelRight.toTriangles()
	].flat();
}

function renderRook(topLeft: Point, width: number): Triangle[] {
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const baseTopLeft = new Point(middleX-(width/3), middleY-(width/4));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	const base = new Rect(baseTopLeft, baseBottomRight);
	
	const leftTopLeft = new Point(middleX-(width/3), middleY-(width*3/8));
	const leftBottomRight = new Point(middleX-(width/6), middleY-(width/12));
	const left = new Rect(leftTopLeft, leftBottomRight);
	
	const centerTopLeft = new Point(middleX-(width/12), middleY-(width*3/8));
	const centerBottomRight = new Point(middleX+(width/12), middleY-(width/12));
	const center = new Rect(centerTopLeft, centerBottomRight);

	const rightTopLeft = new Point(middleX+(width/6), middleY-(width*3/8));
	const rightBottomRight = new Point(middleX+(width/3), middleY-(width/12));
	const right = new Rect(rightTopLeft, rightBottomRight);

	return [
		base.toTriangles(),
		left.toTriangles(),
		center.toTriangles(),
		right.toTriangles()
	].flat();
}

function renderBishop(topLeft: Point, width: number): Triangle[] {
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const body = new Circle(new Point(middleX, middleY), width*(3/16));
	const hat = new Circle(new Point(middleX, middleY - (width/4)), width/16);

	const baseTopLeft = new Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	const base = new Rect(baseTopLeft, baseBottomRight);

	return [
		body.toTriangles(),
		hat.toTriangles(),
		base.toTriangles()
	].flat();
}

function renderKnight(topLeft: Point, width: number): Triangle[] {
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);
	
	const baseTopLeft = new Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	const base = new Rect(baseTopLeft, baseBottomRight);

	const bodyTopLeft = new Point(middleX-(width/3), middleY-(width/3));
	const bodyBottomRight = new Point(middleX-(width/8), middleY+(width/3));
	const body = new Rect(bodyTopLeft, bodyBottomRight);

	const neckTopLeft = new Point(middleX-(width/3), middleY-(width/3));
	const neckBottomRight = new Point(middleX+(width/3), middleY-(width/8));
	const neck = new Rect(neckTopLeft, neckBottomRight);

	const noseTopLeft = new Point(middleX+(width/8), middleY-(width/3));
	const noseBottomRight = new Point(middleX+(width/3), middleY);
	const nose = new Rect(noseTopLeft, noseBottomRight);

	const ear = new Circle(new Point(middleX-(width/12), middleY-(width/3)), width/12);

	return [
		base.toTriangles(),
		body.toTriangles(),
		neck.toTriangles(),
		nose.toTriangles(),
		ear.toTriangles()
	].flat();
}

function renderPawn(topLeft: Point, width: number): Triangle[] {
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const topCircle = new Circle(new Point(middleX, middleY - (width/6)), width/8);

	const stemTopLeft = new Point(middleX-(width/16), middleY - (width/6));
	const stemBottomRight = new Point(middleX+(width/16), middleY + (width/4));
	const stem = new Rect(stemTopLeft, stemBottomRight);

	const baseTopLeft = new Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = new Point(middleX+(width/3), middleY+(width/3));
	const base = new Rect(baseTopLeft, baseBottomRight);

	return [
		topCircle.toTriangles(),
		stem.toTriangles(),
		base.toTriangles()
	].flat();
}

function renderMove(boardRect: Rect, squareSize: number, move: ChessMove, perspective: ChessPerspective): Structure[] {
	const color = rensets.generalWindow.teamColor[move.team];

	const displayFrom = rotateSquare(move.from, perspective);
	const displayTo = rotateSquare(move.to, perspective);

	const fromRect = getSquareValues(boardRect.leftTop, squareSize, displayFrom).squareRect;
	const toRect = getSquareValues(boardRect.leftTop, squareSize, displayTo).squareRect;

	cwCanvas.outlineRect(Shape.from(fromRect, color), 2);
	cwCanvas.outlineRect(Shape.from(toRect, color), 2);
	cwCanvas.arrow(fromRect.center, toRect.center, color, 2);
}
