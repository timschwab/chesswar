import { CarryLoadType } from "../../../../common/data-types/carryLoad.ts";
import { ChessMove } from "../../../../common/data-types/chess.ts";
import { BriefingName } from "../../../../common/data-types/facility.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { SafeState } from "../../game-logic/state.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { teamPerspective, renderBoard } from "./ChessboardHelper.ts";
import { UiComponentRenderer } from "./UiComponentRenderer.ts";

export class MiniChessboardRenderer implements UiComponentRenderer {
	private allStructures: Structure[] = [];

	setState(state: SafeState): void {
		const team = state.selfPlayer.team;
		const teamBoard = state.team.board;
		const carrying = state.ui.carrying;

		const boardRect1 = new Rect(new Point(10, 40), new Point(10+(8*20), 40+(8*20)));
		const perspective = teamPerspective(team);
	
		const mainBoard = renderBoard(boardRect1, teamBoard, [], perspective);

		if (carrying.type === CarryLoadType.EMPTY) {
			this.allStructures = mainBoard;
		} else {
			let board = teamBoard;
			const moves = [] as ChessMove[];
	
			if (carrying.type == CarryLoadType.ORDERS) {
				moves.push(carrying.load);
			} else if (carrying.type == CarryLoadType.ESPIONAGE) {
				const load = carrying.load;
				load[BriefingName.ONE] && moves.push(load[BriefingName.ONE]);
				load[BriefingName.TWO] && moves.push(load[BriefingName.TWO]);
				load[BriefingName.THREE] && moves.push(load[BriefingName.THREE]);
			} else if (carrying.type == CarryLoadType.INTEL) {
				board = carrying.load;
			}
	
			const boardRect2 = new Rect(new Point(10, 40+10+(8*20)), new Point(10+(8*20), 40+10+2*((8*20))));
			const secondBoard = renderBoard(boardRect2, board, moves, perspective);

			this.allStructures = mainBoard.concat(secondBoard);
		}
	}

	getStructures(): Structure[] {
		return this.allStructures;
	}

	getTextData(): CWText[] {
		return [];
	}
}
