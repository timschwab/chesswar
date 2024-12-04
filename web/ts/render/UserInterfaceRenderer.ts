import { PlayerRole, TeamName } from "../../../common/data-types/base.ts";
import { bindToScreen } from "../core/screen.ts";
import { StructureRenderer } from "../webgl/structure/StructureRenderer.ts";
import { TextRenderer } from "../webgl/text/TextRenderer.ts";
import { TeamRoleRenderer } from "./UserInterface/TeamRoleRenderer.ts";

export class UserInterfaceRenderer {
	private readonly textRenderer;
	private readonly structureRenderer;

	private readonly teamRoleRenderer;

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
		this.teamRoleRenderer = new TeamRoleRenderer(this.textRenderer.glyphBoundingBox);
	}

	setState(team: TeamName, role: PlayerRole): void {
		this.teamRoleRenderer.setData(role, team);

		const structures = [this.teamRoleRenderer.getStructures()].flat();
		const textData = [this.teamRoleRenderer.getTextData()].flat();

		this.structureRenderer.setStructures(structures);
		this.textRenderer.setTextData(textData);
	}

	render(): void {
		this.structureRenderer.render();
		this.textRenderer.render();
	}
}
