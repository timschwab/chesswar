import { clampNumber } from "./math-utils.ts";

export type ColorWebglArray = [
	number, number, number,
	number, number, number,
	number, number, number
];

export class Color {
	readonly r: number;
	readonly g: number;
	readonly b: number;

	// Stored as floats in the range [0, 1]
	constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	asHtml(): string {
		const rInt = clampNumber(Math.floor(this.r*256), 0, 255);
		const gInt = clampNumber(Math.floor(this.g*256), 0, 255);
		const bInt = clampNumber(Math.floor(this.b*256), 0, 255);

		const rStr = rInt.toString(16).padStart(2, "0");
		const gStr = gInt.toString(16).padStart(2, "0");
		const bStr = bInt.toString(16).padStart(2, "0");

		return "#" + rStr + gStr + bStr;
	}

	asArray(): ColorWebglArray {
		return [this.r, this.g, this.b, this.r, this.g, this.b, this.r, this.g, this.b];
	}
}

export const CWColor = {
	RED_STANDARD: new Color(160, 0, 0),

	YELLOW_STANDARD: new Color(160, 160, 0),
	YELLOW_DARK: new Color(96, 96, 0),

	GREEN_BRIGHT: new Color(0, 192, 0),
	GREEN_STANDARD: new Color(0, 160, 0),
	GREEN_DARK: new Color(0, 128, 0),

	CYAN_STANDARD: new Color(0, 160, 160),
	CYAN_DARK: new Color(0, 64, 64),

	BLUE_LIGHT: new Color(64, 64, 250),
	BLUE_STANDARD: new Color(0, 0, 160),

	PINK_STANDARD: new Color(160, 0, 160),
	PINK_DARK: new Color(64, 0, 64),

	GREY_WHITE: new Color(250, 250, 250),
	GREY_LIGHT: new Color(160, 160, 160),
	GREY_STANDARD: new Color(128, 128, 128),
	GREY_DARK: new Color(64, 64, 64),
	GREY_EXTRA_DARK: new Color(32, 32, 32),
	GREY_BLACK: new Color(0, 0, 0)
};
