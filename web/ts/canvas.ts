import { Color } from "../../common/colors.ts";
import { transposePoint } from "../../common/shapes/transpose.ts";
import { Circle, Point, Rect, Vector } from "../../common/shapes/types.ts";
import { TAU_EIGHTH, multiply, pointToVector, vectorToPoint } from "../../common/shapes/vector.ts";
import dom from "./dom.ts";

export enum TextAlign {
	LEFT = "left",
	CENTER = "center",
	RIGHT = "right"
}

const context = getContext();

if (!context) {
	throw "Could not load 2D canvas context";
}

function getContext(): CanvasRenderingContext2D {
	const maybeContext = dom.canvas.getContext("2d");

	if (!maybeContext) {
		throw "Could not get 2D canvas context";
	}

	return maybeContext;
}

function line(start: Point, finish: Point, color: Color, lineWidth: number) {
	context.strokeStyle = color;
	context.lineWidth = lineWidth;

	context.beginPath();
	context.moveTo(start.x, start.y);
	context.lineTo(finish.x, finish.y);
	context.stroke();
}

function arrow(start: Point, finish: Point, color: Color, lineWidth: number) {
	const vec = multiply(pointToVector(transposePoint(finish, start)), 1/4);
	const leftVec = Vector(vec.mag, vec.dir+TAU_EIGHTH);
	const rightVec = Vector(vec.mag, vec.dir-TAU_EIGHTH);

	const leftWing = transposePoint(finish, vectorToPoint(leftVec));
	const rightWing = transposePoint(finish, vectorToPoint(rightVec));

	line(start, finish, color, lineWidth);
	line(leftWing, finish, color, lineWidth);
	line(rightWing, finish, color, lineWidth);
}

function outlineRect(rect: Rect, color: Color, lineWidth: number) {
	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	context.strokeRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
}

function fillRect(rect: Rect, color: Color) {
	context.fillStyle = color;
	context.fillRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
}

function fillCircle(circle: Circle, color: Color) {
	context.fillStyle = color;
	context.beginPath();
	context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
	context.fill();
}

function text(position: Rect, align: TextAlign, message: string, font: string, color: Color) {
	const alignX = {
		left: position.topLeft.x,
		center: position.center.x,
		right: position.bottomRight.x,
	}[align];

	context.fillStyle = color;
	context.font = font;
	context.textAlign = align;
	context.textBaseline = "middle";
	context.fillText(message, alignX, position.center.y);
}

export default {
	line,
	arrow,
	outlineRect,
	fillRect,
	fillCircle,
	text
};
