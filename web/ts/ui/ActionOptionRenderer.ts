import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { PlayerAction } from "../../../common/data-types/base.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas, TextAlign } from "../canvas/CWCanvas.ts";

export class ActionOptionRenderer {
	private actionOption: Deferred<PlayerAction | null>;

	constructor() {
		this.actionOption = new Deferred(null);
	}

	setActionOption(option: PlayerAction | null) {
		this.actionOption.set(option);
	}

	render(cwCanvas: CWCanvas, screen: Rect) {
		const optionDiff = this.actionOption.get();

		if (optionDiff.pending == null) {
			// Do nothing
		} else {
			this.renderInternal(cwCanvas, screen, optionDiff.pending);
		}
	}

	forceRender(cwCanvas: CWCanvas, screen: Rect) {
		const optionDiff = this.actionOption.get();
		const coalescedOption = optionDiff.pending || optionDiff.current;
		if (coalescedOption != null) {
			this.renderInternal(cwCanvas, screen, coalescedOption);
		}
	}

	renderInternal(cwCanvas: CWCanvas, screen: Rect, option: PlayerAction) {
		const actionRectWidth = 500;
		const actionTopLeft = new Point(screen.center.x-(actionRectWidth/2), 10);
		const actionBottomRight = new Point(screen.center.x+(actionRectWidth/2), 50);
		const actionRect = new Rect(actionTopLeft, actionBottomRight);

		cwCanvas.fillRect(new Shape(actionRect, rensets.actionOption.backgroundColor));
		cwCanvas.outlineRect(new Shape(actionRect, rensets.actionOption.outlineColor), rensets.actionOption.outlineWidth);
		cwCanvas.text(actionRect, TextAlign.CENTER, "Available action: " + (option || ""), rensets.actionOption.textFont, rensets.actionOption.textColor);
	}
}
