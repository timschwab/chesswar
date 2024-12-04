import { Rect } from "../../../../common/shapes/Rect.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { SafeState } from "../../game-logic/state.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { UiComponentRenderer } from "./UiComponentRenderer.ts";

export class StatsRenderer implements UiComponentRenderer {
	private readonly glyphBoundingBox;

	constructor(glyphBoundingBox: Rect) {
		this.glyphBoundingBox = glyphBoundingBox;
	}

	setState(state: SafeState): void {
		state.ui;
	}

	getStructures(): Structure[] {
		return [];
	}
	
	getTextData(): CWText[] {
		return [];
	};
}
