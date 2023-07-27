import { CarryLoadType } from "../../../common/data-types/carryLoad.ts";
import { ChessMove } from "../../../common/data-types/chess.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { Point, Rect } from "../../../common/shapes/types.ts";
import { renderBoard, teamPerspective } from "../chessboard.ts";
import { SafeState } from "../state.ts";

export function renderMiniChessboard(state: SafeState) {
	const boardRect1 = Rect(Point(10, 40), Point(10+(8*20), 40+(8*20)));
	const perspective = teamPerspective(state.self.team);

	// renderBoard(boardRect1, state.teamBoard.value(), [], perspective);

	if (state.carrying.type == CarryLoadType.EMPTY) {
		// Don't render the second board
	} else {
		const boardRect2 = Rect(Point(10, 40+10+(8*20)), Point(10+(8*20), 40+10+2*((8*20))));
		let board = state.teamBoard.value();
		const moves = [] as ChessMove[];

		if (state.carrying.type == CarryLoadType.ORDERS) {
			moves.push(state.carrying.load);
		} else if (state.carrying.type == CarryLoadType.ESPIONAGE) {
			const load = state.carrying.load;
			load[BriefingName.ONE] && moves.push(load[BriefingName.ONE]);
			load[BriefingName.TWO] && moves.push(load[BriefingName.TWO]);
			load[BriefingName.THREE] && moves.push(load[BriefingName.THREE]);
		} else if (state.carrying.type == CarryLoadType.INTEL) {
			board = state.carrying.load;
		}

		// renderBoard(boardRect2, board, moves, perspective);
	}
}
