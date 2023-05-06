import { Point, Rect } from "./data-types/structures.ts";

const width = 5000;
const height = 3000;

const middle = Point(width / 2, height / 2);

const deathRects = [
	Rect(Point(middle.x - 100, 0), Point(middle.x + 100, 500))
];

const map = {
	width,
	height,
	start: middle,
	deathRects
};

export type ChesswarMap = typeof map;

export default map;
