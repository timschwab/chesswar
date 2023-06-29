import { Circle, Point, Rect } from "./data-types/shapes.ts";
import { TeamName } from "./data-types/base.ts";

const width = 6000;
const height = 3000;

const middleX = width/2;
const middleY = height/2;
const middle = Point(middleX, middleY);

const blueStart1 = Point(200, 200);
const blueStart2 = Point(200, height-200);
const blueStart3 = Point(200, middleY);

const blueBase = Rect(Point(0, middleY-300), Point(400, middleY+300));
const blueCommand = Rect(Point(0, middleY-100), Point(100, middleY+100));

const blueBriefing1 = Rect(Point(150, middleY-250), Point(250, middleY-150));
const blueBriefing2 = Rect(Point(250, middleY-50), Point(350, middleY+50));
const blueBriefing3 = Rect(Point(150, middleY+150), Point(250, middleY+250));

const blueOutpost1 = Rect(Point(0, 0), Point(300, 300));
const blueArmory = Rect(Point(50, 50), Point(150, 150));

const blueOutpost2 = Rect(Point(0, height-300), Point(300, height));
const blueScif = Rect(Point(50, height-150), Point(150, height-50));

const redStart1 = Point(width-200, 200);
const redStart2 = Point(width-200, height-200);
const redStart3 = Point(width-200, middleY);

const redBase = Rect(Point(width-400, middleY-300), Point(width, middleY+300));
const redCommand = Rect(Point(width-100, middleY-100), Point(width, middleY+100));

const redBriefing1 = Rect(Point(width-250, middleY-250), Point(width-150, middleY-150));
const redBriefing2 = Rect(Point(width-350, middleY-50), Point(width-250, middleY+50));
const redBriefing3 = Rect(Point(width-250, middleY+150), Point(width-150, middleY+250));

const redOutpost1 = Rect(Point(width-300, 0), Point(width, 300));
const redArmory = Rect(Point(width-150, 50), Point(width-50, 150));

const redOutpost2 = Rect(Point(width-300, height-300), Point(width, height));
const redScif = Rect(Point(width-150, height-150), Point(width-50, height-50));

const deathRects = [
	Rect(Point(middleX - 100, 100), Point(middleX + 100, 500)),
	Rect(Point(middleX - 100, height-500), Point(middleX + 100, height-100)),
	Rect(Point(middleX - 1300, 1000), Point(middleX - 1100, height-1000)),
	Rect(Point(middleX + 1100, 1000), Point(middleX + 1300, height-1000))
];

const deathCircles = [
	Circle(Point(middleX-700, 700), 100),
	Circle(Point(middleX+700, 700), 100),
	Circle(Point(middleX-700, height-700), 100),
	Circle(Point(middleX+700, height-700), 100)
];

const safeZone = Circle(middle, 300);
const battlefield = Circle(middle, 50);

const map = {
	width,
	height,
	starts: {
		[TeamName.BLUE]: [blueStart1, blueStart2, blueStart3],
		[TeamName.RED]: [redStart1, redStart2, redStart3]
	},
	facilities: [
		{
			team: TeamName.BLUE,
			command: blueCommand,
			base: blueBase,
			briefings: [blueBriefing1, blueBriefing2, blueBriefing3],
			outposts: [blueOutpost1, blueOutpost2],
			armory: blueArmory,
			scif: blueScif
		},
		{
			team: TeamName.RED,
			command: redCommand,
			base: redBase,
			briefings: [redBriefing1, redBriefing2, redBriefing3],
			outposts: [redOutpost1, redOutpost2],
			armory: redArmory,
			scif: redScif
		}
	],
	deathRects,
	deathCircles,
	safeZone,
	battlefield
};

export type ChesswarMap = typeof map;

export default map;
