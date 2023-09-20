import { TAU, TAU_EIGHTH } from "../../../common/Constants.ts";
import { Color } from "../../../common/colors.ts";
import { Circle } from "../../../common/shapes/Circle.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { Text } from "../../../common/shapes/Text.ts";
import { Vector } from "../../../common/shapes/Vector.ts";

export class CWCanvas {
	private readonly context: CanvasRenderingContext2D;

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

	setSize(size: Rect) {
		this.context.canvas.width = size.width;
		this.context.canvas.height = size.height;
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
		const vec = Vector.fromPoint(start.subtract(finish)).divide(4);
		const leftVec = new Vector(vec.dir+TAU_EIGHTH, vec.mag);
		const rightVec = new Vector(vec.dir-TAU_EIGHTH, vec.mag);
	
		const leftWing = finish.add(leftVec.toPoint());
		const rightWing = finish.add(rightVec.toPoint());

		console.log(start, finish, vec, leftVec, leftWing);
	
		this.line(start, finish, color, lineWidth);
		this.line(leftWing, finish, color, lineWidth);
		this.line(rightWing, finish, color, lineWidth);
	}

	outlineRect(rect: Shape<Rect>, lineWidth: number) {
		this.context.strokeStyle = rect.color;
		this.context.lineWidth = lineWidth;
		this.context.strokeRect(rect.geo.left, rect.geo.top, rect.geo.width, rect.geo.height);
	}

	fillRect(rect: Shape<Rect>) {
		if (rect.geo.width > 0 && rect.geo.height > 0) {
			this.context.fillStyle = rect.color;
			this.context.fillRect(rect.geo.left, rect.geo.top, rect.geo.width, rect.geo.height);
		}
	}

	clearRect(rect: Rect) {
		if (rect.width > 0 && rect.height > 0) {
			this.context.clearRect(rect.left, rect.top, rect.width, rect.height);
		}
	}

	fillCircle(circle: Shape<Circle>) {
		this.context.fillStyle = circle.color;
		this.context.beginPath();
		this.context.arc(circle.geo.center.x, circle.geo.center.y, circle.geo.radius, 0, TAU);
		this.context.fill();
	}

	text(text: Text) {
		const alignX = {
			left: text.geo.left,
			center: text.geo.center.x,
			right: text.geo.right,
		}[text.align];
	
		this.context.fillStyle = text.color;
		this.context.font = text.font;
		this.context.textAlign = text.align;
		this.context.textBaseline = "middle";
		this.context.fillText(text.message, alignX, text.geo.center.y);
	}
}
