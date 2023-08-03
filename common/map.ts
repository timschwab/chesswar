import { TeamName } from "./data-types/base.ts";
import { Circle } from "./shapes/Circle.ts";
import { Point } from "./shapes/Point.ts";
import { Rect } from "./shapes/Rect.ts";
import { ZeroPoint } from "./shapes/Zero.ts";

const width = 6000;
const height = 3000;
const rect = new Rect(ZeroPoint, new Point(width, height));

const middleX = width/2;
const middleY = height/2;
const middle = new Point(middleX, middleY);

const blueStart1 = new Point(200, 200);
const blueStart2 = new Point(200, height-200);
const blueStart3 = new Point(200, middleY);

const blueBase = new Rect(new Point(0, middleY-300), new Point(400, middleY+300));
const blueCommand = new Rect(new Point(0, middleY-100), new Point(100, middleY+100));

const blueBriefing1 = new Rect(new Point(150, middleY-250), new Point(250, middleY-150));
const blueBriefing2 = new Rect(new Point(250, middleY-50), new Point(350, middleY+50));
const blueBriefing3 = new Rect(new Point(150, middleY+150), new Point(250, middleY+250));

const blueOutpost1 = new Rect(new Point(0, 0), new Point(300, 300));
const blueArmory = new Rect(new Point(50, 50), new Point(150, 150));

const blueOutpost2 = new Rect(new Point(0, height-300), new Point(300, height));
const blueScif = new Rect(new Point(50, height-150), new Point(150, height-50));

const redStart1 = new Point(width-200, 200);
const redStart2 = new Point(width-200, height-200);
const redStart3 = new Point(width-200, middleY);

const redBase = new Rect(new Point(width-400, middleY-300), new Point(width, middleY+300));
const redCommand = new Rect(new Point(width-100, middleY-100), new Point(width, middleY+100));

const redBriefing1 = new Rect(new Point(width-250, middleY-250), new Point(width-150, middleY-150));
const redBriefing2 = new Rect(new Point(width-350, middleY-50), new Point(width-250, middleY+50));
const redBriefing3 = new Rect(new Point(width-250, middleY+150), new Point(width-150, middleY+250));

const redOutpost1 = new Rect(new Point(width-300, 0), new Point(width, 300));
const redArmory = new Rect(new Point(width-150, 50), new Point(width-50, 150));

const redOutpost2 = new Rect(new Point(width-300, height-300), new Point(width, height));
const redScif = new Rect(new Point(width-150, height-150), new Point(width-50, height-50));

const minefields = [
	new Rect(new Point(middleX - 100, 100), new Point(middleX + 100, 500)),
	new Rect(new Point(middleX - 100, height-500), new Point(middleX + 100, height-100)),
	new Rect(new Point(middleX - 1300, 1000), new Point(middleX - 1100, height-1000)),
	new Rect(new Point(middleX + 1100, 1000), new Point(middleX + 1300, height-1000)),

	new Circle(new Point(middleX-700, 700), 100),
	new Circle(new Point(middleX+700, 700), 100),
	new Circle(new Point(middleX-700, height-700), 100),
	new Circle(new Point(middleX+700, height-700), 100)
];

const safeZone = new Circle(middle, 300);
const battlefield = new Circle(middle, 50);

const map = {
	width,
	height,
	rect,
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
	minefields,
	safeZone,
	battlefield
};

export type ChesswarMap = typeof map;

export default map;
