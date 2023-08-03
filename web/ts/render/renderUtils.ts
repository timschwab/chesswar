import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";

// Find where on the map the top left of the camera hits
export function cameraTopLeft(screen: Rect, pos: Point) {
	return new Point(Math.floor(pos.x - screen.width / 2), Math.floor(pos.y - screen.height / 2));
}
