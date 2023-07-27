import { Color } from "../../../common/colors.ts";
import { transposePoint } from "../../../common/shapes/transpose.ts";
import { Circle, Point, Rect, Vector } from "../../../common/shapes/types.ts";
import { TAU_EIGHTH, multiply, pointToVector, vectorToPoint } from "../../../common/shapes/vector.ts";

export enum TextAlign {
	LEFT = "left",
	CENTER = "center",
	RIGHT = "right"
}

export class CWCanvas {
	private context: CanvasRenderingContext2D

	constructor(htmlCanvas: HTMLCanvasElement) {
		this.context = this.getContext(htmlCanvas);
	}

	private getContext(htmlCanvas: HTMLCanvasElement): CanvasRenderingContext2D {
		const maybeContext = htmlCanvas.getContext("2d");

		if (!maybeContext) {
			throw "Could not get 2D canvas context";
		}

		return maybeContext;
	}

	clearRect(rect: Rect) {
		if (rect.width > 0 && rect.height > 0) {
			this.context.clearRect(rect.left, rect.top, rect.width, rect.height);
		}
	}

	clearAll() {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	}

	line(start: Point, finish: Point, color: Color, lineWidth: number) {
		this.context.strokeStyle = color;
		this.context.lineWidth = lineWidth;
	
		this.context.beginPath();
		this.context.moveTo(start.x, start.y);
		this.context.lineTo(finish.x, finish.y);
		this.context.stroke();
	}

	arrow(start: Point, finish: Point, color: Color, lineWidth: number) {
		const vec = multiply(pointToVector(transposePoint(finish, start)), 1/4);
		const leftVec = Vector(vec.mag, vec.dir+TAU_EIGHTH);
		const rightVec = Vector(vec.mag, vec.dir-TAU_EIGHTH);
	
		const leftWing = transposePoint(finish, vectorToPoint(leftVec));
		const rightWing = transposePoint(finish, vectorToPoint(rightVec));
	
		this.line(start, finish, color, lineWidth);
		this.line(leftWing, finish, color, lineWidth);
		this.line(rightWing, finish, color, lineWidth);
	}

	outlineRect(rect: Rect, color: Color, lineWidth: number) {
		this.context.strokeStyle = color;
		this.context.lineWidth = lineWidth;
		this.context.strokeRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
	}

	fillRect(rect: Rect, color: Color) {
		if (rect.width > 0 && rect.height > 0) {
			this.context.fillStyle = color;
			this.context.fillRect(rect.left, rect.top, rect.width, rect.height);
		}
	}

	fillCircle(circle: Circle, color: Color) {
		this.context.fillStyle = color;
		this.context.beginPath();
		this.context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
		this.context.fill();
	}

	text(position: Rect, align: TextAlign, message: string, font: string, color: Color) {
		const alignX = {
			left: position.topLeft.x,
			center: position.center.x,
			right: position.bottomRight.x,
		}[align];
	
		this.context.fillStyle = color;
		this.context.font = font;
		this.context.textAlign = align;
		this.context.textBaseline = "middle";
		this.context.fillText(message, alignX, position.center.y);
	}
}
