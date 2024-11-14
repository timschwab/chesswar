import { mapStructures } from "../../../common/map/MapValues.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { StructureRenderer } from "../webgl/structure/StructureRenderer.ts";

export class MapRenderer {
	private readonly structureRenderer;

	constructor() {
		this.structureRenderer = new StructureRenderer();
		this.structureRenderer.setStructures(mapStructures);
	}

	setCamera(camera: Point): void {
		this.structureRenderer.setCamera(camera);
	}

	render(): void {
		this.structureRenderer.render();
	}
}
