import { CWColor } from "../../../common/Color.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Structure } from "../../../common/shapes/Structure.ts";
import { ClientPlayer } from "../game-logic/ClientPlayer.ts";
import { StructureRenderer } from "../webgl/structure/StructureRenderer.ts";
import { CWText } from "../webgl/text/CWText.ts";
import { TextRenderer } from "../webgl/text/TextRenderer.ts";

const NAME_LENGTH = 8;
const FONT_SIZE = 0.1;

export class PlayerRenderer {
	private readonly textRenderer;
	private readonly structureRenderer;
	private readonly nameOffset;

	constructor() {
		// Create from back to front
		this.textRenderer = new TextRenderer();
		this.structureRenderer = new StructureRenderer();

		this.nameOffset = new Point(
			this.textRenderer.glyphBoundingBox.right * (NAME_LENGTH/2) * FONT_SIZE * -1,
			this.textRenderer.glyphBoundingBox.bottom * FONT_SIZE);
	}

	setCamera(camera: Point): void {
		this.structureRenderer.setCamera(camera);
		this.textRenderer.setCamera(camera);
	}

	setPlayers(players: ClientPlayer[]): void {
		// Extract out the structures and set them
		const playerStructures = players.map(player =>
			new Structure(player.position.toTriangles(), rensets.players.teamColor[player.team])
		);
		this.structureRenderer.setStructures(playerStructures);

		// Extract out the player names and set them
		const playerNames = players.map(player =>
			new CWText(
				player.id.slice(0, NAME_LENGTH),
				new Point(player.position.center.x, player.position.bottom).add(this.nameOffset),
				FONT_SIZE,
				CWColor.GREY_BLACK)
		);
		this.textRenderer.setTextData(playerNames);
	}

	render(): void {
		this.structureRenderer.render();
		this.textRenderer.render();
	}
}
