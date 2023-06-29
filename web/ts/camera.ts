import { Color } from "../../common/colors.ts";
import { Circle, Point, Rect } from "../../common/data-types/shapes.ts";
import { transposeCircle, transposePoint, transposeRect } from "../../common/shape-logic/transpose.ts";
import canvas from "./canvas.ts";

let camRect: Rect;

function setCamera(rect: Rect): void {
	camRect = rect;
}

function getCamera(): Rect {
	return camRect;
}

function fillScreen(color: Color) {
	const screenTopLeft = Point(0, 0);
	const screenBottomRight = Point(camRect.width, camRect.height);
	const screenRect = Rect(screenTopLeft, screenBottomRight);
	canvas.fillRect(screenRect, color);
}

function outlineRect(rect: Rect, color: Color, lineWidth: number) {
	const adjustedRect = transposeRect(rect, camRect.topLeft);
	canvas.outlineRect(adjustedRect, color, lineWidth);
}

function fillRect(rect: Rect, color: Color) {
	const adjustedRect = transposeRect(rect, camRect.topLeft);
	canvas.fillRect(adjustedRect, color);
}

function line(start: Point, finish: Point, color: Color, lineWidth: number) {
	const adjustedStart = transposePoint(start, camRect.topLeft);
	const adjustedFinish = transposePoint(finish, camRect.topLeft);
	canvas.line(adjustedStart, adjustedFinish, color, lineWidth);
}

function fillCircle(circle: Circle, color: Color) {
	const adjustedCircle = transposeCircle(circle, camRect.topLeft);
	canvas.fillCircle(adjustedCircle, color);
}

function text(position: Rect, align: "left" | "center" | "right", message: string, font: string, color: Color) {
	const adjustedPosition = transposeRect(position, camRect.topLeft);
	canvas.text(adjustedPosition, align, message, font, color);
}

export default {
	setCamera,
	getCamera,
	fillScreen,
	outlineRect,
	fillRect,
	line,
	fillCircle,
	text
};
