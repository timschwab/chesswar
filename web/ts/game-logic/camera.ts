import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { domObject } from "../canvas/dom.ts";
import { scene } from "../scene/scene.ts";

let widthHeight: null | Point = null;
let center: null | Point = null;

export function handleScreenChange(rect: Rect) {
	widthHeight = rect.rightBottom;

	for (const canv of Object.values(domObject)) {
		canv.width = widthHeight.x;
		canv.height = widthHeight.y;
	}

	setCamera();
}

export function handleSelfPosition(position: Point) {
	center = position;
	setCamera();
}

function setCamera() {
	if (widthHeight == null || center == null) {
		return;
	}

	const halfWidthHeight = new Point(widthHeight.x/2, widthHeight.y/2);
	const leftTop = center.subtract(halfWidthHeight);
	const rightBottom = center.add(halfWidthHeight);
	const rect = new Rect(leftTop, rightBottom);

	scene.setCamera(rect);
}
