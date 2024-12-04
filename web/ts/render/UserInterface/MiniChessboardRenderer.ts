import { Rect } from "../../../../common/shapes/Rect.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { ZeroRect } from "../../../../common/shapes/Zero.ts";
import { bindToScreen } from "../../core/screen.ts";
import { SafeState } from "../../game-logic/state.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { UiComponentRenderer } from "./UiComponentRenderer.ts";

export class MiniChessboardRenderer implements UiComponentRenderer {
	private screen: Rect = ZeroRect;

	private allStructures: Structure[] = [];

	constructor() {
		bindToScreen(screenValue => { this.screen = screenValue });
	}

	setState(_state: SafeState): void {
		// nothin yet
	}

	getStructures(): Structure[] {
		return this.allStructures;
	}

	getTextData(): CWText[] {
		return [];
	}
}
