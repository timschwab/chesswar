import { Color } from "../../common/colors.ts";
import { transposeCircle, transposePoint, transposeRect } from "../../common/shapes/transpose.ts";
import { Circle, Point, Rect } from "../../common/shapes/types.ts";
import { CWCanvas, TextAlign } from "./canvas/CWCanvas.ts";

export class CWCamera {
	private camRect: Rect;
	private canvas: CWCanvas;

	constructor(cwCanvas: CWCanvas, rect: Rect) {
		this.camRect = rect;
		this.canvas = cwCanvas;
	}

	getRect(): Rect {
		return this.camRect;
	}

	clear() {
		this.canvas.clearAll();
	}

	fillScreen(color: Color) {
		const screenTopLeft = Point(0, 0);
		const screenBottomRight = Point(this.camRect.width, this.camRect.height);
		const screenRect = Rect(screenTopLeft, screenBottomRight);
		this.canvas.fillRect(screenRect, color);
	}

	outlineRect(rect: Rect, color: Color, lineWidth: number) {
		const adjustedRect = transposeRect(rect, this.camRect.topLeft);
		this.canvas.outlineRect(adjustedRect, color, lineWidth);
	}

	fillRect(rect: Rect, color: Color) {
		const adjustedRect = transposeRect(rect, this.camRect.topLeft);
		this.canvas.fillRect(adjustedRect, color);
	}

	line(start: Point, finish: Point, color: Color, lineWidth: number) {
		const adjustedStart = transposePoint(start, this.camRect.topLeft);
		const adjustedFinish = transposePoint(finish, this.camRect.topLeft);
		this.canvas.line(adjustedStart, adjustedFinish, color, lineWidth);
	}

	fillCircle(circle: Circle, color: Color) {
		const adjustedCircle = transposeCircle(circle, this.camRect.topLeft);
		this.canvas.fillCircle(adjustedCircle, color);
	}

	text(position: Rect, align: TextAlign, message: string, font: string, color: Color) {
		const adjustedPosition = transposeRect(position, this.camRect.topLeft);
		this.canvas.text(adjustedPosition, align, message, font, color);
	}
}
