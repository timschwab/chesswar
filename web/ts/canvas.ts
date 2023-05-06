import { Color } from "../../common/colors.ts";
import { Circle, Point, Rect } from "../../common/data-types/structures.ts";
import dom from "./dom.ts";

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

function outlineRect(rect: Rect, color: Color, lineWidth: number) {
	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	context.strokeRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
}

function fillRect(rect: Rect, color: Color) {
	context.fillStyle = color;
	context.fillRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
}

function line(start: Point, finish: Point, color: Color, lineWidth: number) {
	context.strokeStyle = color;
	context.lineWidth = lineWidth;

	context.beginPath();
	context.moveTo(start.x, start.y);
	context.lineTo(finish.x, finish.y);
	context.stroke();
}

function fillCircle(circle: Circle, color: Color) {
	context.fillStyle = color;
	context.beginPath();
	context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
	context.fill();
}

export default {
	outlineRect,
	fillRect,
	line,
	fillCircle
};
