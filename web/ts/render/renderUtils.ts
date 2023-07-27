import { Point, Rect } from "../../../common/shapes/types.ts";

// Find where on the map the top left of the camera hits
export function cameraTopLeft(screen: Rect, pos: Point) {
	return Point(Math.floor(pos.x - screen.width / 2), Math.floor(pos.y - screen.height / 2));
}
