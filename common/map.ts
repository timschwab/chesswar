import { Circle, Point, Rect } from "./data-types/shapes.ts";
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
	Rect(Point(middle.x - 100, height-500), Point(middle.x + 100, height)),
	Rect(Point(1200, 1000), Point(1400, height-1000)),
	Rect(Point(width-1400, 1000), Point(width-1200, height-1000))
];

const deathCircles = [
	Circle(Point(1800, 700), 100),
	Circle(Point(width-1800, 700), 100),
	Circle(Point(1800, height-700), 100),
	Circle(Point(width-1800, height-700), 100)
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
	deathCircles,
	safeZone
};

export type ChesswarMap = typeof map;

export default map;
