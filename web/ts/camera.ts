import { Circle, Point, Rect, Vector } from "../../common/data-types/structures.ts";
import canvas from "./canvas.ts";
import { Color } from "./colors.ts";

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

// Tranpose functions
function transposePoint(original: Point, move: Vector): Point {
	return Point(original.x-move.x, original.y-move.y);
}
function transposeRect(original: Rect, move: Vector) {
	return Rect(transposePoint(original.topLeft, move), transposePoint(original.bottomRight, move));
}
function transposeCircle(original: Circle, move: Vector) {
	return Circle(transposePoint(original.center, move), original.radius);
}

export default {
	setCamera,
	fillScreen,
	outlineRect,
	fillRect,
	line,
	fillCircle
};
