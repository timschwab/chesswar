import { CWColor } from "../../common/Color.ts";
import { Point } from "../../common/shapes/Point.ts";
import { Structure } from "../../common/shapes/Structure.ts";
import { TriangleVertices } from "../../common/shapes/Triangle.ts";
import { Triangle } from "../../common/shapes/Triangle.ts";
import { StructureRenderer } from "./webgl/structure/StructureRenderer.ts";
import { CWText } from "./webgl/text/CWText.ts";
import { TextRenderer } from "./webgl/text/TextRenderer.ts";

const structureRenderer = new StructureRenderer();
const textRenderer = new TextRenderer();

const triangleVertices = new TriangleVertices(
	new Point(0, 0),
	new Point(0, 100),
	new Point(100, 0)
);
const triangle = new Triangle(triangleVertices, CWColor.BLUE_LIGHT);
const triangles = [triangle];
const center = new Point(100, 100);
const structureScale = 1
const structure = new Structure(triangles, center, structureScale);
const structures = [structure];
const camera = new Point(100, 100);

const message = "ABC 123 $%^ | . ?";
const topLeft = new Point(50, 50);
const textScale = 0.5;
const color = CWColor.GREY_BLACK;
const text = new CWText(message, topLeft, textScale, color);

initGame();

export async function initGame() {
	requestAnimationFrame(gameLoop);
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	structureRenderer.renderStructures(structures, camera);
	textRenderer.renderText(text);
}
