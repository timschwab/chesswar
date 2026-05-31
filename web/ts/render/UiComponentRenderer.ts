import { ChesswarState } from "../game-logic/CWClientState.ts";

export interface UiComponentRenderer {
	render: (state: ChesswarState) => void;
}
