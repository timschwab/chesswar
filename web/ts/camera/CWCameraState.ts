import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";

interface CWCameraUnsafeState {
	screen: Rect | null,
	boxCenter: Point | null
}

export class CWCameraState {
	private screen: Rect | null;
	private boxCenter: Point | null;

	constructor() {
		this.screen = null;
		this.boxCenter = null;
	}

	static isSafe(maybeSafe: CWCameraUnsafeState): maybeSafe is CWCameraSafeState {
		return true;
	}
}
