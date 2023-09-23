import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";
import { createHtmlCanvas } from "../canvas/dom.ts";
import { ActionOptionRenderer } from "./ActionOptionRenderer.ts";
import { GeneralWindowRenderer } from "./GeneralWindowRenderer.ts";
import { MiniChessboardRenderer } from "./MiniChessboardRenderer.ts";
import { StatsRenderer } from "./StatsRenderer.ts";
import { TeamRoleRenderer } from "./TeamRoleRenderer.ts";
import { VictoryRenderer } from "./VictoryRenderer.ts";

export class CwUserInterface {
	private screen: Deferred<Rect>;
	private mainCanvas: CWCanvas;
	private victoryCanvas: CWCanvas;

	public readonly teamRole: TeamRoleRenderer;
	public readonly actionOption: ActionOptionRenderer;
	public readonly generalWindow: GeneralWindowRenderer;
	public readonly miniChessboard: MiniChessboardRenderer;
	public readonly victory: VictoryRenderer;
	public readonly stats: StatsRenderer

	constructor(screen: Rect) {
		this.screen = new Deferred(screen);

		const mainHtmlCanvas = createHtmlCanvas(1);
		const victoryHtmlCanvas = createHtmlCanvas(2);

		this.mainCanvas = new CWCanvas(mainHtmlCanvas);
		this.victoryCanvas = new CWCanvas(victoryHtmlCanvas);

		this.teamRole = new TeamRoleRenderer(this.mainCanvas);
		this.actionOption = new ActionOptionRenderer(this.mainCanvas);
		this.generalWindow = new GeneralWindowRenderer(this.mainCanvas);
		this.miniChessboard = new MiniChessboardRenderer(this.mainCanvas);
		this.victory = new VictoryRenderer(this.victoryCanvas);
		this.stats = new StatsRenderer(this.mainCanvas);
	}

	render() {
		const screenDiff = this.screen.get();
		if (screenDiff.dirty) {
			// New screen
			this.forceRenderAll(screenDiff.latest);
		} else {
			// No change in the screen
			this.renderAll(screenDiff.latest);
		}
	}

	renderAll(screen: Rect) {
		this.teamRole.render(screen);
		this.actionOption.render(screen);
		this.generalWindow.render(screen);
		this.miniChessboard.render(screen);
		this.victory.render(screen);
		this.stats.render(screen);
	}

	forceRenderAll(screen: Rect) {
		this.teamRole.forceRender(screen);
		this.actionOption.forceRender(screen);
		this.generalWindow.forceRender(screen);
		this.miniChessboard.forceRender(screen);
		this.victory.forceRender(screen);
		this.stats.forceRender(screen);
	}

	setScreen(newScreen: Rect) {
		this.mainCanvas.setSize(newScreen);
		this.victoryCanvas.setSize(newScreen);
		this.screen.set(newScreen);
	}
}
