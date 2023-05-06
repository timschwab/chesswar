import { Point } from "./data-types/structures.ts";

const width = 5000;
const height = 3000;

const middle = new Point(width / 2, height / 2);

const deathRects = [
	{
		topLeft: {
			x: middle.x - 100,
			y: 0
		},
		bottomRight: {
			x: middle.x + 100,
			y: 500
		}
	}
];

const map = {
	width,
	height,
	start: middle,
	deathRects
};

export type ChesswarMap = typeof map;

export default map;
