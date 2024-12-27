import { bindToScreen } from "../core/screen.ts";
import { SafeState } from "../game-logic/state.ts";
import { StructureRenderer } from "../webgl/structure/StructureRenderer.ts";
import { TextRenderer } from "../webgl/text/TextRenderer.ts";
import { ActionOptionRenderer } from "./UserInterface/ActionOptionRenderer.ts";
import { GeneralWindowRenderer } from "./UserInterface/GeneralWindowRenderer.ts";
import { MiniChessboardRenderer } from "./UserInterface/MiniChessboardRenderer.ts";
import { StatsRenderer } from "./UserInterface/StatsRenderer.ts";
import { TeamRoleRenderer } from "./UserInterface/TeamRoleRenderer.ts";
import { VictoryRenderer } from "./UserInterface/VictoryRenderer.ts";

export class UserInterfaceRenderer {
	private readonly textRenderer;
	private readonly structureRenderer;

	private readonly renderHelpers;

	constructor() {
		// Create from back to front
		this.structureRenderer = new StructureRenderer();
		this.textRenderer = new TextRenderer();

		// Bind the camera to the center of the screen
		bindToScreen(screenValue => {
			this.structureRenderer.setCamera(screenValue.center);
			this.textRenderer.setCamera(screenValue.center);
		});

		// Get the component renderers
		this.renderHelpers = [
			//new TeamRoleRenderer(this.textRenderer.glyphBoundingBox),
			//new ActionOptionRenderer(this.textRenderer.glyphBoundingBox),
			//new GeneralWindowRenderer(),
			//new MiniChessboardRenderer(),
			new StatsRenderer(this.textRenderer.glyphBoundingBox),
			//new VictoryRenderer(this.textRenderer.glyphBoundingBox)
		];
	}

	async setState(state: SafeState) {
		this.renderHelpers.forEach(helper => helper.setState(state));

		const structures = this.renderHelpers.flatMap(helper=> helper.getStructures());
		const textData = this.renderHelpers.flatMap(helper=> helper.getTextData());

		this.structureRenderer.setStructures(structures);
		await this.textRenderer.setTextData(textData);
	}

	render(): void {
		//this.structureRenderer.render();
		this.textRenderer.render();
	}
}
