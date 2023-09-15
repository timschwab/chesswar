import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { TeamName } from "../../../common/data-types/base.ts";
import { ChessBoard, ChessMove } from "../../../common/data-types/chess.ts";
import { BriefingBundle, BriefingName, empytBriefingBundle } from "../../../common/data-types/facility.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";
import { renderBoard, teamPerspective } from "./ChessboardRenderHelper.ts";

export class GeneralWindowRenderer {
	private cwCanvas: CWCanvas;
	private team: Deferred<TeamName>;
	private show: Deferred<boolean>;
	private teamBoard: Deferred<ChessBoard | null>;
	private briefings: Deferred<BriefingBundle>;
	private enemyBriefings: Deferred<BriefingBundle>;

	constructor(cwCanvas: CWCanvas) {
		this.cwCanvas = cwCanvas;
		this.team = new Deferred(TeamName.BLUE);
		this.show = new Deferred(false);
		this.teamBoard = new Deferred(null);
		this.briefings = new Deferred(empytBriefingBundle());
		this.enemyBriefings = new Deferred(empytBriefingBundle());
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

		const padding = genwin.padding;
		const squareSize = genwin.squareSize;
		const buttonSize = genwin.buttonSize;

		const boardSize = squareSize*8;
		const windowWidth = padding + boardSize + padding + buttonSize + padding;
		const windowHeight = padding + boardSize + padding;

		const middleX = screen.width/2;
		const middleY = screen.height/2;

		const topLeftX = middleX - windowWidth/2;
		const topLeftY = middleY - windowHeight/2;
		const bottomRightX = middleX + windowWidth/2;
		const bottomRightY = middleY + windowHeight/2;

		const windowRectRaw = new Rect(new Point(topLeftX, topLeftY), new Point(bottomRightX, bottomRightY));
		const windowRect = windowRectRaw.floor();

		if (show) {
			const boardTopLeftX = topLeftX + padding;
			const boardTopLeftY = topLeftY + padding;
			const boardRect = new Rect(new Point(boardTopLeftX, boardTopLeftY), new Point(topLeftX+boardSize+padding, topLeftY+boardSize+padding));

			const buttonX = topLeftX + padding + boardSize + padding;
			const button1Y = topLeftY + padding;
			const button2Y = middleY - buttonSize/2;
			const button3Y = bottomRightY - padding - buttonSize;

			const button1Rect = new Rect(new Point(buttonX, button1Y), new Point(buttonX+buttonSize, button1Y+buttonSize));
			const button2Rect = new Rect(new Point(buttonX, button2Y), new Point(buttonX+buttonSize, button2Y+buttonSize));
			const button3Rect = new Rect(new Point(buttonX, button3Y), new Point(buttonX+buttonSize, button3Y+buttonSize));

			// Draw window
			this.cwCanvas.fillRect(new Shape(windowRect, genwin.windowInside));
			this.cwCanvas.outlineRect(new Shape(windowRect, genwin.windowOutline), 5);

			// Draw buttons
			this.cwCanvas.fillRect(new Shape(button1Rect, genwin.button));
			this.cwCanvas.fillRect(new Shape(button2Rect, genwin.button));
			this.cwCanvas.fillRect(new Shape(button3Rect, genwin.button));

			// Draw chessboard squares
			const teamMoves = [briefings[BriefingName.ONE], briefings[BriefingName.TWO], briefings[BriefingName.THREE]];
			//teamMoves.push(state.general.selectedFrom ? {from: state.general.selectedFrom, to: state.general.selectedFrom, team: state.self.team} : null);
			
			const enemyMoves = [enemyBriefings[BriefingName.ONE], enemyBriefings[BriefingName.TWO], enemyBriefings[BriefingName.THREE]];

			let moves = enemyMoves.concat(teamMoves);
			moves = moves.filter(move => move != null);

			const perspective = teamPerspective(team);
			if (teamBoard != null) {
				renderBoard(this.cwCanvas, boardRect, teamBoard, moves as ChessMove[], perspective);
			}
		} else {
			this.cwCanvas.clearRect(windowRect.expand(5));
		}
	}
}
