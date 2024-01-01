import { createHook } from "../../../common/hooks.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { ZeroPoint } from "../../../common/shapes/Zero.ts";

const hook = createHook<Rect>();
export const screenChange = hook.register;
export let screenValue = getScreen();

globalThis.addEventListener("resize", function() {
	const screenRect = getScreen()
	screenValue = screenRect;
	hook.run(screenRect);
});

function getScreen(): Rect {
	// Get the window dimensions
	const width = globalThis.innerWidth;
	const height = globalThis.innerHeight;

	// Construct the rect
	const screenRect = new Rect(ZeroPoint, new Point(width, height));
	return screenRect;
}
