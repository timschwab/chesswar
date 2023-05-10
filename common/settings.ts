import { addPlayer } from "../api/events.ts";
import { Color } from "./colors.ts";
import { PlayerType } from "./data-types/types-base.ts";

/* ----- start server origins ----- */
export const remoteApiServer = {
	scheme: "wss://",
	hostname: "api.chesswar.io",
	port: 443
}
export const localApiServer = {
	scheme: "ws://",
	hostname: "localhost",
	port: 18357
}
export const remoteWebServer = {
	scheme: "https://",
	hostname: "chesswar.io",
	port: 443
}
export const localWebServer = {
	scheme: "http://",
	hostname: "localhost",
	port: 8357
}

export const remoteApiServerOrigin = remoteApiServer.scheme + remoteApiServer.hostname + ":" + remoteApiServer.port;
export const localApiServerOrigin = localApiServer.scheme + localApiServer.hostname + ":" + localApiServer.port;
export const remoteWebServerOrigin = remoteWebServer.scheme + remoteWebServer.hostname + ":" + remoteWebServer.port;
export const localWebServerOrigin = localWebServer.scheme + localWebServer.hostname + ":" + localWebServer.port;

/* ----- start build settings ----- */
export const buildSettings = {
	bundleDir: "web/bundle"
}

/* ----- start game engine ----- */
export const gameEngine = {
	startingRole: PlayerType.SOLDIER,
	physics: {
		[PlayerType.SOLDIER]: {
			acceleration: 1,
			maxSpeed: 10,
			playerRadius: 5
		},
		[PlayerType.GENERAL]: {
			acceleration: 0,
			maxSpeed: 0,
			playerRadius: 5
		},
		[PlayerType.TANK]: {
			acceleration: 0.5,
			maxSpeed: 20,
			playerRadius: 20
		},
		[PlayerType.SPY]: {
			acceleration: 0.5,
			maxSpeed: 5,
			playerRadius: 3
		}
	}
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
		self: Color.BLUE_STANDARD,
		allies: Color.GREEN_STANDARD,
		enemies: Color.RED_STANDARD
	},
	facilities: {
		ally: {
			base: Color.GREY_WHITE,
			command: Color.GREY_LIGHT,
			pickup: Color.YELLOW_STANDARD,
			outpost: Color.GREY_WHITE,
			armory: Color.PINK_STANDARD,
			intel: Color.CYAN_STANDARD
		},
		enemy: {
			base: Color.GREY_EXTRA_DARK,
			command: Color.GREY_BLACK,
			pickup: Color.YELLOW_DARK,
			outpost: Color.GREY_EXTRA_DARK,
			armory: Color.PINK_DARK,
			intel: Color.CYAN_DARK
		}
	},
	death: {
		color: Color.GREY_BLACK
	},
	safe: {
		color: Color.GREEN_DARK
	}
};
