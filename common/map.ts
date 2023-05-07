import { Circle, Point, Rect } from "./data-types/structures.ts";
import { TeamName } from "./data-types/types-base.ts";

const width = 5000;
const height = 3000;

const middleX = width/2;
const middleY = height/2;

const middle = Point(middleX, middleY);

const alphaStart1 = Point(200, 200);
const alphaStart2 = Point(200, height-200);
const alphaStart3 = Point(400, middleY);

const bravoStart1 = Point(width-200, 200);
const bravoStart2 = Point(width-200, height-200);
const bravoStart3 = Point(width-400, middleY);

const deathRects = [
	Rect(Point(middle.x - 100, 0), Point(middle.x + 100, 500)),
	Rect(Point(middle.x - 100, height-500), Point(middle.x + 100, height))
];

const safeZone = Circle(middle, 500);

const map = {
	width,
	height,
	starts: {
		[TeamName.ALPHA]: [alphaStart1, alphaStart2, alphaStart3],
		[TeamName.BRAVO]: [bravoStart1, bravoStart2, bravoStart3]
	},
	deathRects,
	safeZone
};

export type ChesswarMap = typeof map;

export default map;
