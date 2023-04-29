import colors from "./colors.js";
import environment from "./environment.ts";

// Global settings
let rendering = {
	background: colors.grey.dark,
	grid: {
		background: colors.grey.standard,
		color: colors.grey.extraDark,
		width: 1,
		spacing: 100
	},
	mapBorder: {
		color: colors.green.bright,
		width: 5
	},
	players: {
		radius: 5,
		self: colors.blue.standard,
		allies: colors.green.standard,
		enemies: colors.red.standard
	},
	death: {
		color: colors.grey.black
	}
};

// Settings determined by env
let server = {
	local: "ws://localhost:18357",
	remote: "wss://api.chesswar.io"
}[environment];

// Construct settings export
let settings = {
	server,
	rendering
};

// Export
export default settings;
