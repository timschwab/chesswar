import { Structure } from "../../../../common/shapes/Structure.ts";
import { SafeState } from "../../game-logic/state.ts";
import { CWText } from "../../webgl/text/CWText.ts";

export interface UiComponentRenderer {
	setState: (state: SafeState) => void,
	getStructures: () => Structure[],
	getTextData: () => CWText[]
}
