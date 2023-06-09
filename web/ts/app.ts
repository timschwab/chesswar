import { initAudio } from "./audioPlayer.ts";
import { initGame } from "./clientGame.ts";
import { initInputs } from "./inputs.ts";
import { initScreen } from "./screen.ts";
import { initSocket } from "./socket.ts";

main();

function main() {
	initSocket();
	initScreen();
	initInputs();
	initAudio();

	initGame();
}
