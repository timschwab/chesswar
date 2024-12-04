import { bindToScreen } from "../core/screen.ts";
import { SafeState } from "../game-logic/state.ts";
import { StructureRenderer } from "../webgl/structure/StructureRenderer.ts";
import { TextRenderer } from "../webgl/text/TextRenderer.ts";
import { ActionOptionRenderer } from "./UserInterface/ActionOptionRenderer.ts";
import { TeamRoleRenderer } from "./UserInterface/TeamRoleRenderer.ts";

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
			new TeamRoleRenderer(this.textRenderer.glyphBoundingBox),
			new ActionOptionRenderer(this.textRenderer.glyphBoundingBox)
		];
	}

	setState(state: SafeState): void {
		this.renderHelpers.forEach(helper => helper.setState(state));

		const structures = this.renderHelpers.flatMap(helper=> helper.getStructures());
		const textData = this.renderHelpers.flatMap(helper=> helper.getTextData());

		this.structureRenderer.setStructures(structures);
		this.textRenderer.setTextData(textData);
	}

	render(): void {
		this.structureRenderer.render();
		this.textRenderer.render();
	}
}
