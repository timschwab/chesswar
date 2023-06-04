import { Color } from "./colors.ts";
import { PlayerRole, TeamName } from "./data-types/base.ts";

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
	startingRole: PlayerRole.SOLDIER,
	frictionCoef: 0.5,
	dragCoef: 0.1,
	physics: {
		[PlayerRole.GENERAL]: {
			radius: 15,
			mass: Infinity,
			inputForceMag: 0
		},
		[PlayerRole.SOLDIER]: {
			radius: 5,
			mass: 2,
			inputForceMag: 5
		},
		[PlayerRole.TANK]: {
			radius: 25,
			mass: 5,
			inputForceMag: 15
		},
		[PlayerRole.OPERATIVE]: {
			radius: 3,
			mass: 2,
			inputForceMag: 5
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
		self: Color.GREEN_BRIGHT,
		teamColor: {
			[TeamName.ALPHA]: Color.BLUE_LIGHT,
			[TeamName.BRAVO]: Color.RED_STANDARD
		},
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
	center: {
		safe: Color.GREEN_DARK,
		battlefield: Color.GREY_WHITE
	},
	generalWindow: {
		padding: 20,
		squareSize: 50,
		buttonSize: 100,
		windowOutline: Color.GREEN_BRIGHT,
		windowInside: Color.GREY_WHITE,
		boardOutline: Color.GREY_BLACK,
		boardLight: Color.GREY_LIGHT,
		boardDark: Color.GREY_DARK,
		teamColor: {
			[TeamName.ALPHA]: Color.BLUE_LIGHT,
			[TeamName.BRAVO]: Color.RED_STANDARD
		},
		button: Color.YELLOW_STANDARD
	},
	actionOption: {
		outlineWidth: 3,
		outlineColor: Color.GREY_BLACK,
		backgroundColor: Color.GREY_LIGHT,
		textFont: "24px Times New Roman",
		textColor: Color.GREY_EXTRA_DARK
	},
	currentRole: {
		outlineWidth: 2,
		outlineColor: Color.GREY_BLACK,
		teamColor: {
			[TeamName.ALPHA]: Color.BLUE_LIGHT,
			[TeamName.BRAVO]: Color.RED_STANDARD
		},
		textFont: "18px Times New Roman",
		textColor: Color.GREY_WHITE
	},
	victory: {
		font: "bold 128px Times New Roman",
		color: Color.GREY_BLACK
	},
	stats: {
		font: "12px Times New Roman",
		color: Color.GREY_BLACK
	}
};
