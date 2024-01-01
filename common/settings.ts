import { CWColor } from "./Color.ts";
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
const tps = 20;
const mspt = 1000/tps;

export const gameEngine = {
	tps,
	mspt,
	//deathTicks: tps*5,
	deathTicks: 1,
	newGameTicks: tps*30,
	startingRole: PlayerRole.SOLDIER,
	startingClump: 100,
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
const fps = 30;
export const rensets = {
	fps,
	mspf: 1000/fps,
	fpsMsMargin: 0.1,
	background: CWColor.GREY_DARK,
	grid: {
		background: CWColor.GREY_STANDARD,
		color: CWColor.GREY_EXTRA_DARK,
		width: 1,
		spacing: 100
	},
	mapBorder: {
		color: CWColor.GREEN_BRIGHT,
		width: 4
	},
	players: {
		self: CWColor.GREEN_BRIGHT,
		teamColor: {
			[TeamName.BLUE]: CWColor.BLUE_LIGHT,
			[TeamName.RED]: CWColor.RED_STANDARD
		},
		deathCounter: {
			font: "12px Times New Roman",
			color: CWColor.GREY_BLACK
		},
		name: {
			font: "12px Times New Roman",
			color: CWColor.GREY_BLACK
		}
	},
	facilities: {
		ally: {
			base: CWColor.GREY_WHITE,
			command: CWColor.GREY_LIGHT,
			pickup: CWColor.YELLOW_STANDARD,
			outpost: CWColor.GREY_WHITE,
			armory: CWColor.PINK_STANDARD,
			scif: CWColor.CYAN_STANDARD
		},
		enemy: {
			base: CWColor.GREY_EXTRA_DARK,
			command: CWColor.GREY_BLACK,
			pickup: CWColor.YELLOW_DARK,
			outpost: CWColor.GREY_EXTRA_DARK,
			armory: CWColor.PINK_DARK,
			scif: CWColor.CYAN_DARK
		}
	},
	minefield: {
		color: CWColor.GREY_BLACK
	},
	center: {
		safe: CWColor.GREEN_DARK,
		battlefield: CWColor.GREY_WHITE
	},
	generalWindow: {
		padding: 20,
		squareSize: 50,
		buttonSize: 100,
		windowOutline: CWColor.GREEN_BRIGHT,
		windowInside: CWColor.GREY_WHITE,
		boardOutline: CWColor.GREY_BLACK,
		boardLight: CWColor.GREY_LIGHT,
		boardDark: CWColor.GREY_DARK,
		teamColor: {
			[TeamName.BLUE]: CWColor.BLUE_LIGHT,
			[TeamName.RED]: CWColor.RED_STANDARD
		},
		button: CWColor.YELLOW_STANDARD
	},
	actionOption: {
		outlineWidth: 3,
		outlineColor: CWColor.GREY_BLACK,
		backgroundColor: CWColor.GREY_LIGHT,
		textFont: "24px Times New Roman",
		textColor: CWColor.GREY_EXTRA_DARK
	},
	currentRole: {
		outlineWidth: 2,
		outlineColor: CWColor.GREY_BLACK,
		teamColor: {
			[TeamName.BLUE]: CWColor.BLUE_LIGHT,
			[TeamName.RED]: CWColor.RED_STANDARD
		},
		textFont: "18px Times New Roman",
		textColor: CWColor.GREY_WHITE
	},
	victory: {
		font: "bold 128px Times New Roman",
		color: CWColor.GREY_BLACK,
		newGameFont: "32px Times New Roman",
		newGameColor: CWColor.GREY_BLACK,
	},
	stats: {
		font: "12px Times New Roman",
		color: CWColor.GREY_BLACK
	}
} as const;
