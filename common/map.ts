import { Point, Rect } from "./data-types/structures.ts";

const width = 5000;
const height = 3000;

const middle = new Point(width / 2, height / 2);

const deathRects = [
	new Rect(new Point(middle.x - 100, 0), new Point(middle.x + 100, 500))
];

const map = {
	width,
	height,
	start: middle,
	deathRects
};

export type ChesswarMap = typeof map;

export default map;
