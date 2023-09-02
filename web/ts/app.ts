import { initGame } from "./clientGame.ts";
import { initInputs } from "./inputs.ts";
import { initSocket } from "./socket.ts";

main();

function main() {
	initSocket();
	initInputs();

	initGame();
}
