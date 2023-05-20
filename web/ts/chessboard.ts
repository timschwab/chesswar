import { Circle, Point, Rect } from "../../common/data-types/shapes.ts";
import { TeamName } from "../../common/data-types/types-base.ts";
import { rensets } from "../../common/settings.ts";
import canvas from "./canvas.ts";

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