import { listenKey } from "./core/inputs.ts";
import { handleKey } from "./game-logic/keys.ts";

initGame();

export function initGame() {
	listenKey(handleKey);
	// listenClick(handleClick);

	requestAnimationFrame(gameLoop);
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	// Do stuff
}
