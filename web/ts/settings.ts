import {Color} from "./colors.ts";
import environment from "./environment.ts";

// Global settings
const rendering = {
	background: Color.GREY_DARK,
	grid: {
		background: Color.GREY_STANDARD,
		color: Color.GREY_EXTRA_DARK,
		width: 1,
		spacing: 100
	},
	mapBorder: {
		color: Color.GREEN_BRIGHT,
		width: 5
	},
	players: {
		radius: 5,
		self: Color.BLUE_STANDARD,
		allies: Color.GREEN_STANDARD,
		enemies: Color.RED_STANDARD
	},
	death: {
		color: Color.GREY_BLACK
	}
};

// Settings determined by env
const server = {
	local: "ws://localhost:18357",
	remote: "wss://api.chesswar.io"
}[environment];

// Construct settings export
const settings = {
	server,
	rendering
};

// Export
export default settings;
