import { Color } from "../../common/colors.ts";
import { Circle } from "../../common/shapes/Circle.ts";
import { Point } from "../../common/shapes/Point.ts";
import { Rect } from "../../common/shapes/Rect.ts";
import { ZeroPoint } from "../../common/shapes/Zero.ts";
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
		const screenTopLeft = ZeroPoint;
		const screenBottomRight = new Point(this.camRect.width, this.camRect.height);
		const screenRect = new Rect(screenTopLeft, screenBottomRight);
		this.canvas.fillRect(screenRect, color);
	}

	outlineRect(rect: Rect, color: Color, lineWidth: number) {
		const adjustedRect = rect.add(this.camRect.leftTop);
		this.canvas.outlineRect(adjustedRect, color, lineWidth);
	}

	fillRect(rect: Rect, color: Color) {
		const adjustedRect = rect.add(this.camRect.leftTop);
		this.canvas.fillRect(adjustedRect, color);
	}

	line(start: Point, finish: Point, color: Color, lineWidth: number) {
		const adjustedStart = start.add(this.camRect.leftTop);
		const adjustedFinish = finish.add(this.camRect.leftTop);
		this.canvas.line(adjustedStart, adjustedFinish, color, lineWidth);
	}

	fillCircle(circle: Circle, color: Color) {
		const adjustedCircle = circle.add(this.camRect.leftTop);
		this.canvas.fillCircle(adjustedCircle, color);
	}

	text(position: Rect, align: TextAlign, message: string, font: string, color: Color) {
		const adjustedPosition = position.add(this.camRect.leftTop);
		this.canvas.text(adjustedPosition, align, message, font, color);
	}
}
