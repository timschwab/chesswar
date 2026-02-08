import { Point } from "./Point.ts";

export class Vector {
	readonly dir: number; // In radians
	readonly mag: number;

	static fromPoints(fromPoint: Point, toPoint: Point): Vector {
		return Vector.fromPoint(fromPoint.subtract(toPoint));
	}

	static fromPoint(point: Point): Vector {
		const dir = Math.atan2(point.y, point.x);
		const mag = Math.sqrt(point.x*point.x + point.y*point.y);
		return new Vector(dir, mag);
	}

	constructor(dir: number, mag: number) {
		this.dir = dir;
		this.mag = mag;
	}

	toPoint(): Point {
		const x = Math.cos(this.dir) * this.mag;
		const y = Math.sin(this.dir) * this.mag;
		return new Point(x, y);
	}

	withMagnitude(mag: number): Vector {
		return new Vector(this.dir, mag);
	}

	add(other: Vector): Vector {
		const thisPoint = this.toPoint();
		const otherPoint = other.toPoint();
		const result = thisPoint.add(otherPoint);

		return Vector.fromPoint(result);
	}

	multiply(scalar: number): Vector {
		return new Vector(this.dir, this.mag*scalar);
	}

	divide(scalar: number): Vector {
		return new Vector(this.dir, this.mag/scalar);
	}

	clockwise(diff: number): Vector {
		return new Vector(this.dir-diff, this.mag);
	}

	counterClockwise(diff: number): Vector {
		return new Vector(this.dir+diff, this.mag);
	}
}
