import { Color } from "./colors.ts";

/* ----- start serverOrigin ----- */
export const remoteServer = {
	scheme: "wss://",
	hostname: "api.chesswar.io",
	port: ""
}
export const remoteServerOrigin = remoteServer.scheme + remoteServer.hostname + remoteServer.port;

export const localServer = {
	scheme: "ws://",
	hostname: "localhost",
	port: 18357
}
export const localServerOrigin = localServer.scheme + localServer.hostname + localServer.port;

/* ----- start gameEngine ----- */
export const gameEngine = {
	acceleration: 0.5,
	maxSpeed: 40
};

/* ----- start rensets ----- */
export const rensets = {
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
