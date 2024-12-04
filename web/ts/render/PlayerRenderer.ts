import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Structure } from "../../../common/shapes/Structure.ts";
import { ClientPlayer } from "../game-logic/ClientPlayer.ts";
import { StructureRenderer } from "../webgl/structure/StructureRenderer.ts";

export class PlayerRenderer {
	private readonly structureRenderer;

	constructor() {
		this.structureRenderer = new StructureRenderer();
	}

	setCamera(camera: Point): void {
		this.structureRenderer.setCamera(camera);
	}

	setPlayers(players: ClientPlayer[]): void {
		this.structureRenderer.setStructures(players.map(player => 
			new Structure(player.position.toTriangles(), rensets.players.teamColor[player.team])
		));
	}

	render(): void {
		this.structureRenderer.render();
	}
}
