import { CWColor } from "../../common/Color.ts";
import { Point } from "../../common/shapes/Point.ts";
import { Structure } from "../../common/shapes/Structure.ts";
import { ZeroPoint } from "../../common/shapes/Zero.ts";
import { mapTriangles } from "./mapTriangles.ts";
import { StructureRenderer } from "./webgl/structure/StructureRenderer.ts";
import { CWText } from "./webgl/text/CWText.ts";
import { TextRenderer } from "./webgl/text/TextRenderer.ts";

const mapRenderer = new StructureRenderer();
const textRenderer = new TextRenderer();

let camera = ZeroPoint;
const map = new Structure(mapTriangles, ZeroPoint, 1);
mapRenderer.setStructures([map]);

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

	camera = camera.add(new Point(1, 1));

	mapRenderer.setCamera(camera);
	mapRenderer.render();
	textRenderer.renderText(text);
}
