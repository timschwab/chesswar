import { CWColor } from "../Color.ts";
import { Circle } from "../shapes/Circle.ts";
import { Point } from "../shapes/Point.ts";
import { Rect } from "../shapes/Rect.ts";
import { Shape } from "../shapes/Shape.ts";
import { ZeroPoint } from "../shapes/Zero.ts";

/***** Settings *****/

// Map rectangle
const width = 6000;
const height = 3000;
const backgroundColor = CWColor.GREY_DARK;

// Facilities
const baseHalfHeight = 300;
const baseWidth = 400;
const baseColor = CWColor.GREY_WHITE;

const commandHalfHeight = 100;
const commandWidth = 100;
const commandColor = CWColor.GREY_LIGHT;

const briefingSize = 100;
const sideBriefingOffset = 50;
const middleBriefingOffset = 50;
const briefingColor = CWColor.YELLOW_STANDARD;

const outpostSize = 300;
const outpostColor = CWColor.GREY_WHITE;

const armorySkifOffset = 50;
const armorySkifSize = 100;

const armoryColor = CWColor.PINK_STANDARD;
const scifColor = CWColor.CYAN_STANDARD;

const startOffset = 200;

// Non-facilities
const middleRectMinefieldOffset = 100;
const middleRectMinefieldHalfWidth = 100;
const middleRectMinefieldHeight = 400;

const sideRectMinefieldOffset = 1200;
const sideRectMinefieldHalfWidth = 100;
const sideRectMinefieldHalfHeight = 500;

const circleMinefieldRadius = 100;
const circleMinefieldTopLeftFromCenter = new Point(700, 800);

const minefieldColor = CWColor.GREY_BLACK;

const dmzRadius = 300;
const dmzColor = CWColor.GREEN_DARK;

const battlefieldRadius = 50;
const battlefieldColor = CWColor.GREY_WHITE;

/***** Computed values from the settings *****/

// Map rectangle and core values
const mapRect = new Rect(ZeroPoint, new Point(width, height));
const mapShape = Shape.from(mapRect, backgroundColor);

const middleX = width/2;
const middleY = height/2;
const middle = new Point(middleX, middleY);

// Blue facilities
const blueBase = new Rect(
	new Point(0,         middleY-baseHalfHeight),
	new Point(baseWidth, middleY+baseHalfHeight));
const blueBaseShape = Shape.from(blueBase, baseColor);

const blueCommand = new Rect(
	new Point(0,            middleY-commandHalfHeight),
	new Point(commandWidth, middleY+commandHalfHeight));
const blueCommandShape = Shape.from(blueCommand, commandColor);

const blueBriefing1 = new Rect(
	new Point(blueCommand.center.x-(briefingSize/2), blueCommand.top+sideBriefingOffset),
	new Point(blueCommand.center.x+(briefingSize/2), blueCommand.top+sideBriefingOffset+briefingSize)
);

const blueBriefing2 = new Rect(
	new Point(blueCommand.right-briefingSize-middleBriefingOffset, blueCommand.center.y-(briefingSize/2)),
	new Point(blueCommand.right-briefingSize,                      blueCommand.center.y+(briefingSize/2))
);

const blueBriefing3 = new Rect(
	new Point(blueCommand.center.x-(briefingSize/2), blueCommand.bottom-sideBriefingOffset-briefingSize),
	new Point(blueCommand.center.x+(briefingSize/2), blueCommand.bottom-sideBriefingOffset)
);

const blueBriefing1Shape = Shape.from(blueBriefing1, briefingColor);
const blueBriefing2Shape = Shape.from(blueBriefing2, briefingColor);
const blueBriefing3Shape = Shape.from(blueBriefing3, briefingColor);

const blueOutpost1 = new Rect(new Point(0, 0), new Point(outpostSize, outpostSize));
const blueOutpost2 = new Rect(new Point(0, height-outpostSize), new Point(outpostSize, height));

const blueOutpost1Shape = Shape.from(blueOutpost1, outpostColor);
const blueOutpost2Shape = Shape.from(blueOutpost2, outpostColor);

const blueArmory = new Rect(
	new Point(armorySkifOffset, armorySkifOffset),
	new Point(armorySkifOffset+armorySkifSize, armorySkifOffset+armorySkifSize)
);
const blueScif = new Rect(
	new Point(armorySkifOffset, height-(armorySkifOffset+armorySkifSize)),
	new Point(armorySkifOffset+armorySkifSize, height-armorySkifOffset)
);

const blueArmoryShape = Shape.from(blueArmory, armoryColor);
const blueScifShape = Shape.from(blueScif, scifColor);

const blueStart1 = new Point(startOffset, startOffset);
const blueStart2 = new Point(startOffset, middleY);
const blueStart3 = new Point(startOffset, height-startOffset);

// Red facilities
const redBaseShape = blueBaseShape.reflectAcrossVertical(middleX);
const redCommandShape = blueCommandShape.reflectAcrossVertical(middleX);

const redBriefing1Shape = blueBriefing1Shape.reflectAcrossVertical(middleX);
const redBriefing2Shape = blueBriefing2Shape.reflectAcrossVertical(middleX);
const redBriefing3Shape = blueBriefing3Shape.reflectAcrossVertical(middleX);

const redOutpost1Shape = blueOutpost1Shape.reflectAcrossVertical(middleX);
const redArmoryShape = blueArmoryShape.reflectAcrossVertical(middleX);

const redOutpost2Shape = blueOutpost2Shape.reflectAcrossVertical(middleX);
const redScifShape = blueScifShape.reflectAcrossVertical(middleX);

const redStart1 = blueStart1.reflectAcrossVertical(middleX);
const redStart2 = blueStart2.reflectAcrossVertical(middleX);
const redStart3 = blueStart3.reflectAcrossVertical(middleX);

// Non-facilities
const minefields = [
	new Rect(
		new Point(middleX - middleRectMinefieldHalfWidth, middleRectMinefieldOffset),
		new Point(middleX + middleRectMinefieldHalfWidth, middleRectMinefieldOffset+middleRectMinefieldHeight)),
	new Rect(
		new Point(middleX - middleRectMinefieldHalfWidth, height-(middleRectMinefieldOffset+middleRectMinefieldHeight)),
		new Point(middleX + middleRectMinefieldHalfWidth, height-middleRectMinefieldOffset)),

	new Rect(
		new Point((middleX-sideRectMinefieldOffset) - sideRectMinefieldHalfWidth, middleY-sideRectMinefieldHalfHeight),
		new Point((middleX-sideRectMinefieldOffset) + sideRectMinefieldHalfWidth, middleY+sideRectMinefieldHalfHeight)),
	new Rect(
		new Point((middleX+sideRectMinefieldOffset) - sideRectMinefieldHalfWidth, middleY-sideRectMinefieldHalfHeight),
		new Point((middleX+sideRectMinefieldOffset) + sideRectMinefieldHalfWidth, middleY+sideRectMinefieldHalfHeight)),

	new Circle(new Point(middleX-circleMinefieldTopLeftFromCenter.x, middleY-circleMinefieldTopLeftFromCenter.y), circleMinefieldRadius),
	new Circle(new Point(middleX+circleMinefieldTopLeftFromCenter.x, middleY-circleMinefieldTopLeftFromCenter.y), circleMinefieldRadius),
	new Circle(new Point(middleX-circleMinefieldTopLeftFromCenter.x, middleY+circleMinefieldTopLeftFromCenter.y), circleMinefieldRadius),
	new Circle(new Point(middleX+circleMinefieldTopLeftFromCenter.x, middleY+circleMinefieldTopLeftFromCenter.y), circleMinefieldRadius),
];
const minefieldShapes = minefields.map(minefield => Shape.from(minefield, minefieldColor));

const dmz = new Circle(middle, dmzRadius);
const dmzShape = Shape.from(dmz, dmzColor);

const battlefield = new Circle(middle, battlefieldRadius);
const battlefieldShape = Shape.from(battlefield, battlefieldColor);

// Export
export const mapSettings = {
	mapShape,

	blueBaseShape,
	blueCommandShape,
	blueBriefing1Shape,
	blueBriefing2Shape,
	blueBriefing3Shape,
	blueOutpost1Shape,
	blueOutpost2Shape,
	blueArmoryShape,
	blueScifShape,
	blueStart1,
	blueStart2,
	blueStart3,

	redBaseShape,
	redCommandShape,
	redBriefing1Shape,
	redBriefing2Shape,
	redBriefing3Shape,
	redOutpost1Shape,
	redOutpost2Shape,
	redArmoryShape,
	redScifShape,
	redStart1,
	redStart2,
	redStart3,

	minefieldShapes,
	dmzShape,
	battlefieldShape
};
