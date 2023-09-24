import { Deferred, SimpleDeferred } from "../../../common/data-structures/Deferred.ts";
import { TeamName } from "../../../common/data-types/base.ts";
import { ChessBoard, ChessMove } from "../../../common/data-types/chess.ts";
import { BriefingBundle, BriefingName, emptyBriefingBundle } from "../../../common/data-types/facility.ts";
import { rensets } from "../../../common/settings.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";
import { state } from "../game-logic/state.ts";
import { renderBoard, teamPerspective } from "./ChessboardHelper.ts";
import { getImportantValues } from "./GeneralWindowHelper.ts";

export class GeneralWindowRenderer {
	private cwCanvas: CWCanvas;
	private team: SimpleDeferred<TeamName>;
	private show: SimpleDeferred<boolean>;
	private teamBoard: Deferred<ChessBoard | null>;
	private briefings: Deferred<BriefingBundle>;
	private enemyBriefings: Deferred<BriefingBundle>;

	constructor(cwCanvas: CWCanvas) {
		this.cwCanvas = cwCanvas;
		this.team = new SimpleDeferred(TeamName.BLUE);
		this.show = new SimpleDeferred(false);
		this.teamBoard = new Deferred(null);
		this.briefings = new Deferred(emptyBriefingBundle());
		this.enemyBriefings = new Deferred(emptyBriefingBundle());
	}

	setTeam(team: TeamName) {
		this.team.set(team);
	}

	setShow(show: boolean) {
		this.show.set(show);
	}

	setTeamBoard(teamBoard: ChessBoard) {
		this.teamBoard.set(teamBoard);
	}

	setBriefings(briefings: BriefingBundle) {
		this.briefings.set(briefings);
	}

	setEnemyBriefings(enemyBriefings: BriefingBundle) {
		this.enemyBriefings.set(enemyBriefings);
	}

	render(screen: Rect) {
		const teamDiff = this.team.get();
		const showDiff = this.show.get();
		const teamBoardDiff = this.teamBoard.get();
		const briefingsDiff = this.briefings.get();
		const enemyBriefingsDiff = this.enemyBriefings.get();

		if (teamDiff.dirty || showDiff.dirty || teamBoardDiff.dirty || briefingsDiff.dirty || enemyBriefingsDiff.dirty) {
			this.renderInternal(screen, teamDiff.latest, showDiff.latest, teamBoardDiff.latest, briefingsDiff.latest, enemyBriefingsDiff.latest);
		}
	}

	forceRender(screen: Rect) {
		const teamDiff = this.team.get();
		const showDiff = this.show.get();
		const teamBoardDiff = this.teamBoard.get();
		const briefingsDiff = this.briefings.get();
		const enemyBriefingsDiff = this.enemyBriefings.get();
		this.renderInternal(screen, teamDiff.latest, showDiff.latest, teamBoardDiff.latest, briefingsDiff.latest, enemyBriefingsDiff.latest);
	}

	renderInternal(screen: Rect, team: TeamName, show: boolean, teamBoard: ChessBoard | null, briefings: BriefingBundle, enemyBriefings: BriefingBundle) {
		const genwin = rensets.generalWindow;
		const importantValues = getImportantValues(screen);

		if (show) {
			// Draw window
			this.cwCanvas.fillRect(new Shape(importantValues.windowRect, genwin.windowInside));
			this.cwCanvas.outlineRect(new Shape(importantValues.windowRect, genwin.windowOutline), 5);

			// Draw buttons
			this.cwCanvas.fillRect(new Shape(importantValues.button1Rect, genwin.button));
			this.cwCanvas.fillRect(new Shape(importantValues.button2Rect, genwin.button));
			this.cwCanvas.fillRect(new Shape(importantValues.button3Rect, genwin.button));

			// Draw selected button
			if (state.general.selectedButton == BriefingName.ONE) {
				this.cwCanvas.outlineRect(new Shape(importantValues.button1Rect, genwin.teamColor[team]), 3);
			} else if (state.general.selectedButton == BriefingName.TWO) {
				this.cwCanvas.outlineRect(new Shape(importantValues.button2Rect, genwin.teamColor[team]), 3);
			} else if (state.general.selectedButton == BriefingName.THREE) {
				this.cwCanvas.outlineRect(new Shape(importantValues.button3Rect, genwin.teamColor[team]), 3);
			}

			// Draw chessboard squares
			const teamMoves = [briefings[BriefingName.ONE], briefings[BriefingName.TWO], briefings[BriefingName.THREE]];
			teamMoves.push(state.general.selectedFrom ? {from: state.general.selectedFrom, to: state.general.selectedFrom, team: team} : null);

			const enemyMoves = [enemyBriefings[BriefingName.ONE], enemyBriefings[BriefingName.TWO], enemyBriefings[BriefingName.THREE]];

			let moves = enemyMoves.concat(teamMoves);
			moves = moves.filter(move => move != null);

			const perspective = teamPerspective(team);
			if (teamBoard != null) {
				renderBoard(this.cwCanvas, importantValues.boardRect, teamBoard, moves as ChessMove[], perspective);
			}
		} else {
			this.cwCanvas.clearRect(importantValues.windowRect.expand(5));
		}
	}
}
