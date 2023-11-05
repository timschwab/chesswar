import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { scene } from "../scene/scene.ts";
import { ui } from "../ui/ui.ts";

let widthHeight: null | Point = null;
let center: null | Point = null;

export function handleScreenChange(rect: Rect) {
	ui.setScreen(rect);
	widthHeight = rect.rightBottom;
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
