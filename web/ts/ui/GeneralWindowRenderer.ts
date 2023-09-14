import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class GeneralWindowRenderer {
	private cwCanvas: CWCanvas;
	private show: Deferred<boolean>;

	constructor(cwCanvas: CWCanvas) {
		this.cwCanvas = cwCanvas;
		this.show = new Deferred(false);
	}

	setShow(show: boolean) {
		this.show.set(show);
	}

	render(screen: Rect) {
		const showDiff = this.show.get();

		if (showDiff.dirty) {
			this.renderInternal(screen, showDiff.latest);
		}
	}

	forceRender(screen: Rect) {
		const showDiff = this.show.get();
		this.renderInternal(screen, showDiff.latest);
	}

	renderInternal(screen: Rect, show: boolean) {
		// Thing
	}
}
