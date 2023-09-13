import { CWCanvas } from "../canvas/CWCanvas.ts";
import { createHtmlCanvas } from "../canvas/dom.ts";
import { TeamRoleRenderer } from "./TeamRoleRenderer.ts";

export class CwUserInterface {
	private cwCanvas: CWCanvas;
	public readonly teamRole: TeamRoleRenderer;

	constructor() {
		const htmlCanvas = createHtmlCanvas(1);
		this.cwCanvas = new CWCanvas(htmlCanvas);
		this.teamRole = new TeamRoleRenderer();
	}

	render() {
		this.teamRole.render(this.cwCanvas);
	}
}
