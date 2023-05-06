import socket from "./socket.ts";
import screen from "./screen.ts";
import inputs from "./inputs.ts";
import game from "./game.ts";

main();

function main() {
	socket.init();
	screen.init();
	inputs.init();

	game.init();
}
