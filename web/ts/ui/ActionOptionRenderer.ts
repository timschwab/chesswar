import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { PlayerAction } from "../../../common/data-types/base.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas, TextAlign } from "../canvas/CWCanvas.ts";

export class ActionOptionRenderer {
	private cwCanvas: CWCanvas;
	private actionOption: Deferred<PlayerAction>;

	constructor(cwCanvas: CWCanvas) {
		this.cwCanvas = cwCanvas;
		this.actionOption = new Deferred(PlayerAction.NONE);
	}

	setActionOption(option: PlayerAction) {
		this.actionOption.set(option);
	}

	render(screen: Rect) {
		const optionDiff = this.actionOption.get();

		if (optionDiff.dirty) {
			this.renderInternal(screen, optionDiff.latest);
		}
	}

	forceRender(screen: Rect) {
		const optionDiff = this.actionOption.get();
		
		this.renderInternal(screen, optionDiff.latest);
	}

	renderInternal(screen: Rect, option: PlayerAction) {
		const actionRectWidth = 500;
		const actionTopLeft = new Point(screen.center.x-(actionRectWidth/2), 10);
		const actionBottomRight = new Point(screen.center.x+(actionRectWidth/2), 50);
		const actionRect = new Rect(actionTopLeft, actionBottomRight);

		this.cwCanvas.fillRect(new Shape(actionRect, rensets.actionOption.backgroundColor));
		this.cwCanvas.outlineRect(new Shape(actionRect, rensets.actionOption.outlineColor), rensets.actionOption.outlineWidth);
		this.cwCanvas.text(actionRect, TextAlign.CENTER, "Available action: " + option, rensets.actionOption.textFont, rensets.actionOption.textColor);
	}
}
