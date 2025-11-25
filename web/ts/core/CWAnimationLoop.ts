import { EventHook } from "../../../common/data-structures/Hook.ts";

export class CWAnimationLoop {
	private readonly hook = new EventHook();

	register(callback: () => void) {
		this.hook.register(callback);
	}

	start() {
		// Start the animation loop
		requestAnimationFrame(this.handleAnimationFrame.bind(this));
	}

	private handleAnimationFrame() {
		// Request the next animation frame
		requestAnimationFrame(this.handleAnimationFrame.bind(this));

		// Call the hook
		this.hook.run();
	}
}
