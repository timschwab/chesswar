import { Rect } from "../../../../common/shapes/Rect.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { ZeroRect } from "../../../../common/shapes/Zero.ts";
import { bindToScreen } from "../../core/screen.ts";
import { SafeState } from "../../game-logic/state.ts";
import { CWText } from "../../webgl/text/CWText.ts";

export class VictoryRenderer {
	private readonly glyphBoundingBox;
	private screen: Rect = ZeroRect;

	private outerRect: Structure | null = null;
	private innerRect: Structure | null = null;

	private actionText: CWText | null = null;

	constructor(glyphBoundingBox: Rect) {
		this.glyphBoundingBox = glyphBoundingBox;

		bindToScreen(screenValue => { this.screen = screenValue });
	}

	setState(_state: SafeState): void {
		// nothing yet
	}

	getStructures(): Structure[] {
		return [];
	}

	getTextData(): CWText[] {
		return [];
	}
}
