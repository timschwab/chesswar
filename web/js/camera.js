import canvas from "./canvas.js";
import structures from "./structures.js";

let camera = undefined;

function setCamera(rect) {
	camera = rect;
}

function fillScreen(color) {
	let screenTopLeft = structures.point(0, 0);
	let screenBottomRight = structures.point(camera.width, camera.height);
	let screenRect = structures.rect(screenTopLeft, screenBottomRight);
	canvas.fillRect(screenRect, color);
}

function outlineRect(rect, color, lineWidth) {
	let adjustedTopLeft = structures.point(
		rect.topLeft.x - camera.topLeft.x,
		rect.topLeft.y - camera.topLeft.y
	);
	let adjustedBottomRight = structures.point(
		rect.bottomRight.x - camera.topLeft.x,
		rect.bottomRight.y - camera.topLeft.y
	);

	let adjustedRect = structures.rect(adjustedTopLeft, adjustedBottomRight);

	canvas.outlineRect(adjustedRect, color, lineWidth);
}

function fillRect(rect, color) {
	let adjustedTopLeft = structures.point(
		rect.topLeft.x - camera.topLeft.x,
		rect.topLeft.y - camera.topLeft.y
	);
	let adjustedBottomRight = structures.point(
		rect.bottomRight.x - camera.topLeft.x,
		rect.bottomRight.y - camera.topLeft.y
	);

	let adjustedRect = structures.rect(adjustedTopLeft, adjustedBottomRight);

	canvas.fillRect(adjustedRect, color);
}

function line(start, finish, color, lineWidth) {
	let adjustedStart = structures.point(
		start.x - camera.topLeft.x,
		start.y - camera.topLeft.y
	);
	let adjustedFinish = structures.point(
		finish.x - camera.topLeft.x,
		finish.y - camera.topLeft.y
	);

	canvas.line(adjustedStart, adjustedFinish, color, lineWidth);
}

function fillCircle(circle, color) {
	let adjustedCenter = structures.point(
		circle.center.x - camera.topLeft.x,
		circle.center.y - camera.topLeft.y
	);
	let adjustedCircle = structures.circle(adjustedCenter, circle.radius);

	canvas.fillCircle(adjustedCircle, color);
}

let api = {
	setCamera,
	fillScreen,
	outlineRect,
	fillRect,
	line,
	fillCircle
};

export default api;
