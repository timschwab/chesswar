import dom from "./dom.js";
let canvas = dom.canvas;
let context = canvas.getContext("2d");

function outlineRect(rect, color, lineWidth) {
	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	context.strokeRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
}

function fillRect(rect, color) {
	context.fillStyle = color;
	context.fillRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
}

function line(start, finish, color, lineWidth) {
	context.strokeStyle = color;
	context.lineWidth = lineWidth;

	context.beginPath();
	context.moveTo(start.x, start.y);
	context.lineTo(finish.x, finish.y);
	context.stroke();
}

function fillCircle(circle, color) {
	context.fillStyle = color;
	context.beginPath();
	context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
	context.fill();
}

let api = {
	outlineRect,
	fillRect,
	line,
	fillCircle
};

export default api;
