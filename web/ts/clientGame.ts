import { rensets } from "../../common/settings.ts";
import { Structure } from "../../common/shapes/Structure.ts";
import { Triangle } from "../../common/shapes/Triangle.ts";
import { ZeroPoint } from "../../common/shapes/Zero.ts";
import { listenKey } from "./core/inputs.ts";
import { socketListen } from "./core/socket.ts";
import { handleKey } from "./game-logic/keys.ts";
import { receiveMessage } from "./game-logic/messages.ts";
import { isSafeState, SafeState, state } from "./game-logic/state.ts";
import { mapTriangles } from "./mapTriangles.ts";
import { StructureRenderer } from "./webgl/structure/StructureRenderer.ts";

// Create the renderers from back to front
const mapRenderer = new StructureRenderer();
// const playerTextRender = new TextRenderer();
const playerRenderer = new StructureRenderer();
// const uiRenderer = new StructureRenderer();
// const uiTextRenderer = new TextRenderer();

const map = new Structure(mapTriangles, ZeroPoint, 1);
mapRenderer.setStructures([map]);

initGame();

function initGame() {
	// Receive server messages
	socketListen(receiveMessage);

	// Send client messages
	listenKey(handleKey);

	// Start rendering
	requestAnimationFrame(gameLoopUnsafe);
}

function gameLoopUnsafe(): void {
	requestAnimationFrame(gameLoopUnsafe);

	if (isSafeState(state)) {
		gameLoopSafe(state);
	}
}

function gameLoopSafe(state: SafeState): void {
	mapRenderer.setCamera(state.selfPlayer.position.center);
	playerRenderer.setCamera(state.selfPlayer.position.center);

	playerRenderer.setStructures(state.players.map(player => {
		const triangles = player.position.toTriangleVertices().map(
			verts => new Triangle(verts, rensets.players.teamColor[player.team]));
		return new Structure(triangles, ZeroPoint, 1);
	}));

	mapRenderer.render();
	playerRenderer.render();
}
