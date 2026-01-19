import { ChesswarState } from "../game-logic/ChesswarState.ts";

export interface UiComponentRenderer {
	render: (state: ChesswarState) => void
}
