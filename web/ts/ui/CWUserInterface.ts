import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";
import { createHtmlCanvas } from "../canvas/dom.ts";
import { ActionOptionRenderer } from "./ActionOptionRenderer.ts";
import { TeamRoleRenderer } from "./TeamRoleRenderer.ts";

export class CwUserInterface {
	private cwCanvas: CWCanvas;
	private screen: Deferred<Rect>;
	public readonly teamRole: TeamRoleRenderer;
	public readonly actionOption: ActionOptionRenderer;

	constructor(screen: Rect) {
		const htmlCanvas = createHtmlCanvas(1);
		this.cwCanvas = new CWCanvas(htmlCanvas);
		this.screen = new Deferred(screen);

		this.teamRole = new TeamRoleRenderer(this.cwCanvas);
		this.actionOption = new ActionOptionRenderer(this.cwCanvas);
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
	}

	forceRenderAll(screen: Rect) {
		this.teamRole.forceRender(screen);
		this.actionOption.forceRender(screen);
	}

	setScreen(newScreen: Rect) {
		this.cwCanvas.setSize(newScreen);
		this.screen.set(newScreen);
	}
}
