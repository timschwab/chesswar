import { Color } from "../../common/colors.ts";
import { Circle, Point, Rect } from "../../common/data-types/shapes.ts";
import { transposeCircle, transposePoint, transposeRect } from "../../common/shape-logic/transpose.ts";
import canvas from "./canvas.ts";

let camera: Rect;

function setCamera(rect: Rect) {
	camera = rect;
}

function fillScreen(color: Color) {
	const screenTopLeft = Point(0, 0);
	const screenBottomRight = Point(camera.width, camera.height);
	const screenRect = Rect(screenTopLeft, screenBottomRight);
	canvas.fillRect(screenRect, color);
}

function outlineRect(rect: Rect, color: Color, lineWidth: number) {
	const adjustedRect = transposeRect(rect, camera.topLeft);
	canvas.outlineRect(adjustedRect, color, lineWidth);
}

function fillRect(rect: Rect, color: Color) {
	const adjustedRect = transposeRect(rect, camera.topLeft);
	canvas.fillRect(adjustedRect, color);
}

function line(start: Point, finish: Point, color: Color, lineWidth: number) {
	const adjustedStart = transposePoint(start, camera.topLeft);
	const adjustedFinish = transposePoint(finish, camera.topLeft);
	canvas.line(adjustedStart, adjustedFinish, color, lineWidth);
}

function fillCircle(circle: Circle, color: Color) {
	const adjustedCircle = transposeCircle(circle, camera.topLeft);
	canvas.fillCircle(adjustedCircle, color);
}

export default {
	setCamera,
	fillScreen,
	outlineRect,
	fillRect,
	line,
	fillCircle
};
