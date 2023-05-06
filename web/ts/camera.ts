import { Circle, Point, Rect } from "../../common/data-types/structures.ts";
import canvas from "./canvas.ts";
import { Color } from "./colors.ts";

let camera: Rect;

function setCamera(rect: Rect) {
	camera = rect;
}

function fillScreen(color: Color) {
	const screenTopLeft = new Point(0, 0);
	const screenBottomRight = new Point(camera.width, camera.height);
	const screenRect = new Rect(screenTopLeft, screenBottomRight);
	canvas.fillRect(screenRect, color);
}

function outlineRect(rect: Rect, color: Color, lineWidth: number) {
	const adjustedRect = rect.transpose(camera.topLeft);
	canvas.outlineRect(adjustedRect, color, lineWidth);
}

function fillRect(rect: Rect, color: Color) {
	const adjustedRect = rect.transpose(camera.topLeft);
	canvas.fillRect(adjustedRect, color);
}

function line(start: Point, finish: Point, color: Color, lineWidth: number) {
	const adjustedStart = start.transpose(camera.topLeft);
	const adjustedFinish = finish.transpose(camera.topLeft);
	canvas.line(adjustedStart, adjustedFinish, color, lineWidth);
}

function fillCircle(circle: Circle, color: Color) {
	const adjustedCircle = circle.transpose(camera.topLeft);
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
