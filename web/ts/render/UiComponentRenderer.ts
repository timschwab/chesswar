import { CWClientState } from "../game-logic/CWClientState.ts";

export interface UiComponentRenderer {
	render: (state: CWClientState) => void;
}
