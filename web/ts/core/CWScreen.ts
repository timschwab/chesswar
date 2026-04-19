import { Hook, HookFunc } from "../../../common/data-structures/Hook.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { ZeroPoint } from "../../../common/shapes/Zero.ts";

export class CWScreen {
	private screenValue: Rect;
	private hook = new Hook<Rect>;

	constructor() {
		this.screenValue = this.getCurrentScreen();
	}

	// Use the callback immediately with the current screenValue
	// and then update it with all future values.
	subscribe(callback: HookFunc<Rect>) {
		callback(this.screenValue);
		this.hook.register(callback);
	}

	bindCanvas(canvas: HTMLCanvasElement) {
		this.subscribe(screenValue => {
			canvas.width = screenValue.width;
			canvas.height = screenValue.height;
		});
	}

	start() {
		globalThis.addEventListener("resize", this.handleResize.bind(this));
	}

	get() {
		return this.screenValue;
	}

	private getCurrentScreen(): Rect {
		// Get the window dimensions
		const width = globalThis.innerWidth;
		const height = globalThis.innerHeight;
	
		// Construct the rect
		const screenRect = new Rect(ZeroPoint, new Point(width, height));
		return screenRect;
	}

	private handleResize() {
		this.screenValue = this.getCurrentScreen();
		this.hook.run(this.screenValue);
	}
}
