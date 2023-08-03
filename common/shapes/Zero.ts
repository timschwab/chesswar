import { Circle } from "./Circle.ts";
import { Point } from "./Point.ts";
import { Rect } from "./Rect.ts";
import { Vector } from "./Vector.ts";

export const ZeroPoint = new Point(0, 0);
export const ZeroRect = new Rect(ZeroPoint, ZeroPoint);
export const ZeroCircle = new Circle(ZeroPoint, 0);
export const ZeroVector = new Vector(0, 0);
