import { Circle, Point, Rect } from "./data-types/shapes.ts";
import { TeamName } from "./data-types/types-base.ts";

const width = 5000;
const height = 3000;

const middleX = width/2;
const middleY = height/2;
const middle = Point(middleX, middleY);

const alphaStart1 = Point(200, 200);
const alphaStart2 = Point(200, height-200);
const alphaStart3 = Point(200, middleY);

const alphaBase = Rect(Point(0, middleY-300), Point(400, middleY+300));
const alphaCommand = Rect(Point(0, middleY-100), Point(100, middleY+100));

const alphaPickup1 = Rect(Point(150, middleY-250), Point(250, middleY-150));
const alphaPickup2 = Rect(Point(250, middleY-50), Point(350, middleY+50));
const alphaPickup3 = Rect(Point(150, middleY+150), Point(250, middleY+250));

const alphaOutpost1 = Rect(Point(0, 0), Point(300, 300));
const alphaOutpost2 = Rect(Point(0, height-300), Point(300, height));

const bravoStart1 = Point(width-200, 200);
const bravoStart2 = Point(width-200, height-200);
const bravoStart3 = Point(width-200, middleY);

const bravoBase = Rect(Point(width-400, middleY-300), Point(width, middleY+300));
const bravoCommand = Rect(Point(width-100, middleY-100), Point(width, middleY+100));

const bravoPickup1 = Rect(Point(width-250, middleY-250), Point(width-150, middleY-150));
const bravoPickup2 = Rect(Point(width-350, middleY-50), Point(width-250, middleY+50));
const bravoPickup3 = Rect(Point(width-250, middleY+150), Point(width-150, middleY+250));

const bravoOutpost1 = Rect(Point(width-300, 0), Point(width, 300));
const bravoOutpost2 = Rect(Point(width-300, height-300), Point(width, height));

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
	facilities: [
		{
			team: TeamName.ALPHA,
			command: alphaCommand,
			base: alphaBase,
			outposts: [alphaOutpost1, alphaOutpost2],
			pickups: [alphaPickup1, alphaPickup2, alphaPickup3]
		},
		{
			team: TeamName.BRAVO,
			command: bravoCommand,
			base: bravoBase,
			outposts: [bravoOutpost1, bravoOutpost2],
			pickups: [bravoPickup1, bravoPickup2, bravoPickup3]
		}
	],
	deathRects,
	deathCircles,
	safeZone
};

export type ChesswarMap = typeof map;

export default map;
