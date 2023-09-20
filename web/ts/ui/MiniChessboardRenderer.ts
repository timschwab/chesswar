import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { TeamName } from "../../../common/data-types/base.ts";
import { CarryLoad, CarryLoadType } from "../../../common/data-types/carryLoad.ts";
import { ChessBoard, ChessMove } from "../../../common/data-types/chess.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";
import { renderBoard, teamPerspective } from "./ChessboardHelper.ts";

export class MiniChessboardRenderer {
	private cwCanvas: CWCanvas;
	private team: Deferred<TeamName | null>;
	private teamBoard: Deferred<ChessBoard | null>;
	private carrying: Deferred<CarryLoad>;

	constructor(cwCanvas: CWCanvas) {
		this.cwCanvas = cwCanvas;
		this.team = new Deferred(null);
		this.teamBoard = new Deferred(null);
		this.carrying = new Deferred({
			type: CarryLoadType.EMPTY,
			load: null
		});
	}

	setTeam(team: TeamName) {
		this.team.set(team);
	}

	setTeamBoard(board: ChessBoard) {
		this.teamBoard.set(board);
	}

	setCarrying(carrying: CarryLoad) {
		this.carrying.set(carrying);
	}

	render(_screen: Rect) {
		const teamDiff = this.team.get();
		const teamBoardDiff = this.teamBoard.get();
		const carryingDiff = this.carrying.get();

		if (teamDiff.dirty || teamBoardDiff.dirty || carryingDiff.dirty) {
			this.renderInternal(teamDiff.latest, teamBoardDiff.latest, carryingDiff.latest);
		}
	}

	forceRender(_screen: Rect) {
		const teamDiff = this.team.get();
		const teamBoardDiff = this.teamBoard.get();
		const carryingDiff = this.carrying.get();

		this.renderInternal(teamDiff.latest, teamBoardDiff.latest, carryingDiff.latest);
	}

	renderInternal(team: TeamName | null, teamBoard: ChessBoard | null, carrying: CarryLoad) {
		if (team == null || teamBoard == null) {
			return;
		}

		const boardRect1 = new Rect(new Point(10, 40), new Point(10+(8*20), 40+(8*20)));
		const perspective = teamPerspective(team);
	
		renderBoard(this.cwCanvas, boardRect1, teamBoard, [], perspective);

		const boardRect2 = new Rect(new Point(10, 40+10+(8*20)), new Point(10+(8*20), 40+10+2*((8*20))));
		if (carrying.type == CarryLoadType.EMPTY) {
			// Don't render the second board
			this.cwCanvas.clearRect(boardRect2.expand(5));
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
	
			renderBoard(this.cwCanvas, boardRect2, board, moves, perspective);
		}
	}
}