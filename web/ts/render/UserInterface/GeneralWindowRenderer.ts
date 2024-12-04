import { PlayerRole } from "../../../../common/data-types/base.ts";
import { BriefingName } from "../../../../common/data-types/facility.ts";
import { rensets } from "../../../../common/settings.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";
import { Shape } from "../../../../common/shapes/Shape.ts";
import { Structure } from "../../../../common/shapes/Structure.ts";
import { ZeroRect } from "../../../../common/shapes/Zero.ts";
import { bindToScreen } from "../../core/screen.ts";
import { SafeState } from "../../game-logic/state.ts";
import { CWText } from "../../webgl/text/CWText.ts";
import { renderBoard, teamPerspective } from "./ChessboardHelper.ts";
import { getImportantValues } from "./GeneralWindowHelper.ts";
import { UiComponentRenderer } from "./UiComponentRenderer.ts";

export class GeneralWindowRenderer implements UiComponentRenderer {
	private readonly glyphBoundingBox;
	private screen: Rect = ZeroRect;

	private allStructures: Structure[] = [];

	constructor(glyphBoundingBox: Rect) {
		this.glyphBoundingBox = glyphBoundingBox;

		bindToScreen(screenValue => { this.screen = screenValue });
	}

	setState(state: SafeState): void {
		// Only show if the player is a general
		if (state.selfPlayer.role !== PlayerRole.GENERAL) {
			this.allStructures = [];
			return;
		}

		const genwin = rensets.generalWindow;
		const importantValues = getImportantValues(this.screen);
		const team = state.selfPlayer.team;
		const briefings = state.team.briefings;
		const enemyBriefings = state.team.enemyBriefings;
		const teamBoard = state.team.board;

		// Draw window
		const innerWindow = Shape.from(importantValues.windowRect, genwin.windowInside).toStructure();
		const outerWindow = Shape.from(importantValues.windowRect.expand(5), genwin.windowOutline).toStructure();

		// Draw buttons
		const button1 = Shape.from(importantValues.button1Rect, genwin.button).toStructure();
		const button2 = Shape.from(importantValues.button2Rect, genwin.button).toStructure();
		const button3 = Shape.from(importantValues.button3Rect, genwin.button).toStructure();

		// Draw selected button
		let briefingSelection: Structure | null = null;
		if (state.ui.general.selectedButton == BriefingName.ONE) {
			briefingSelection = Shape.from(importantValues.button1Rect.expand(3), genwin.teamColor[team]).toStructure();
		} else if (state.ui.general.selectedButton == BriefingName.TWO) {
			briefingSelection = Shape.from(importantValues.button2Rect.expand(3), genwin.teamColor[team]).toStructure();
		} else if (state.ui.general.selectedButton == BriefingName.THREE) {
			briefingSelection = Shape.from(importantValues.button3Rect.expand(3), genwin.teamColor[team]).toStructure();
		}

		this.allStructures = [
			outerWindow, innerWindow,
			button1, button2, button3
		];

		if (briefingSelection === null) {
			this.allStructures = [
				outerWindow, innerWindow,
				button1, button2, button3
			];
		} else {
			this.allStructures = [
				outerWindow, innerWindow,
				briefingSelection,
				button1, button2, button3
			];
		}

		const teamMoves = [briefings[BriefingName.ONE], briefings[BriefingName.TWO], briefings[BriefingName.THREE]];
		teamMoves.push(state.ui.general.selectedFrom ? {from: state.ui.general.selectedFrom, to: state.ui.general.selectedFrom, team: team} : null);

		const enemyMoves = [enemyBriefings[BriefingName.ONE], enemyBriefings[BriefingName.TWO], enemyBriefings[BriefingName.THREE]];

		const moves = enemyMoves.concat(teamMoves).filter(move => move !== null);

		const perspective = teamPerspective(team);
		this.allStructures.push(...renderBoard(importantValues.boardRect, teamBoard, moves, perspective));
	}

	getStructures(): Structure[] {
		return this.allStructures;
	}

	getTextData(): CWText[] {
		return [];
	}
}
