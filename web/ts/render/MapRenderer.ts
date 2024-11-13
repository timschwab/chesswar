import { Point } from "../../../common/shapes/Point.ts";
import { Structure } from "../../../common/shapes/Structure.ts";
import { ZeroPoint } from "../../../common/shapes/Zero.ts";
import { mapTriangles } from "../../../common/map/mapTriangles.ts";
import { StructureRenderer } from "../webgl/structure/StructureRenderer.ts";

export class MapRenderer {
	private readonly structureRenderer;

	constructor() {
		const map = new Structure(mapTriangles, ZeroPoint, 1);

		this.structureRenderer = new StructureRenderer();
		this.structureRenderer.setStructures([map]);
	}

	setCamera(camera: Point): void {
		this.structureRenderer.setCamera(camera);
	}

	render(): void {
		this.structureRenderer.render();
	}
}
