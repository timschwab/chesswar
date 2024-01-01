import { clampNumber } from "./math-utils.ts";

export type ColorArray = [number, number, number];

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

	asArray(): ColorArray {
		return [this.r, this.g, this.b];
	}
}

export const CWColor = {
	RED_STANDARD: new Color(0.7, 0, 0),

	YELLOW_STANDARD: new Color(0.7, 0.7, 0),
	YELLOW_DARK: new Color(0.3, 0.3, 0),

	GREEN_BRIGHT: new Color(0, 0.8, 0),
	GREEN_STANDARD: new Color(0, 0.7, 0),
	GREEN_DARK: new Color(0, 0.5, 0),

	CYAN_STANDARD: new Color(0, 0.7, 0.7),
	CYAN_DARK: new Color(0, 0.2, 0.2),

	BLUE_LIGHT: new Color(0.2, 0.2, 1),
	BLUE_STANDARD: new Color(0, 0, 0.7),

	PINK_STANDARD: new Color(0.7, 0, 0.7),
	PINK_DARK: new Color(0.2, 0, 0.2),

	GREY_WHITE: new Color(1, 1, 1),
	GREY_LIGHT: new Color(0.7, 0.7, 0.7),
	GREY_STANDARD: new Color(0.5, 0.5, 0.5),
	GREY_DARK: new Color(0.2, 0.2, 0.2),
	GREY_EXTRA_DARK: new Color(0.1, 0.1, 0.1),
	GREY_BLACK: new Color(0, 0, 0)
};
