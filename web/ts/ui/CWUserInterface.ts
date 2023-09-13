import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";
import { createHtmlCanvas } from "../canvas/dom.ts";
import { ActionOptionRenderer } from "./ActionOptionRenderer.ts";
import { TeamRoleRenderer } from "./TeamRoleRenderer.ts";

export class CwUserInterface {
	private cwCanvas: CWCanvas;
	private screen: Deferred<Rect | null>;
	public readonly teamRole: TeamRoleRenderer;
	public readonly actionOption: ActionOptionRenderer;

	constructor() {
		const htmlCanvas = createHtmlCanvas(1);
		this.cwCanvas = new CWCanvas(htmlCanvas);
		this.screen = new Deferred(null);

		this.teamRole = new TeamRoleRenderer();
		this.actionOption = new ActionOptionRenderer();
	}

	render() {
		const screenDiff = this.screen.get();
		if (screenDiff.pending == null) {
			if (screenDiff.current == null) {
				// No screen yet
				// Do nothing
			} else {
				// No change in the screen
				this.renderAll(screenDiff.current);
			}
		} else {
			// New screen
			this.forceRenderAll(screenDiff.pending);
		}
	}

	renderAll(screen: Rect) {
		this.teamRole.render(this.cwCanvas, screen);
		this.actionOption.render(this.cwCanvas, screen);
	}

	forceRenderAll(screen: Rect) {
		this.teamRole.forceRender(this.cwCanvas, screen);
		this.actionOption.forceRender(this.cwCanvas, screen);
	}

	setScreen(newScreen: Rect) {
		this.cwCanvas.setSize(newScreen);
		this.screen.set(newScreen);
	}
}
