import camera from "./camera.ts";
import map from "../../common/map.ts";
import { SafeState } from "./state.ts";
import { Circle, Point, Rect } from "../../common/data-types/shapes.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";
import { rensets } from "../../common/settings.ts";
import { Color } from "../../common/colors.ts";
import { ChessPiece, PlayerRole, TeamName } from "../../common/data-types/types-base.ts";
import canvas from "./canvas.ts";

function render(state: SafeState) {
	const selfPlayer = getSelf(state);
	setCamera(state, selfPlayer);
	renderBackground();
	renderMap(selfPlayer);
	renderPlayers(state, selfPlayer);

	if (selfPlayer.role == PlayerRole.GENERAL) {
		renderChessboard(state);
	}
}

function getSelf(state: SafeState): ClientPlayer {
	const maybeSelf = state.playerMap.get(state.self);

	if (!maybeSelf) {
		console.error(state.playerMap, state.self);
		throw "Could not find self";
	}

	return maybeSelf;
}

function setCamera(state: SafeState, selfPlayer: ClientPlayer) {
	const width = state.screen.width;
	const height = state.screen.height;
	const center = selfPlayer.position.center;

	const topLeft = Point(center.x - width / 2, center.y - height / 2);
	const bottomRight = Point(
		center.x + width / 2,
		center.y + height / 2
	);

	const cameraRect = Rect(topLeft, bottomRight);

	camera.setCamera(cameraRect);
}

function renderBackground() {
	// Fill in the background color
	camera.fillScreen(rensets.background);

	// Fill in the map background color
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	camera.fillRect(mapRect, rensets.grid.background);

	// Draw the vertical grid
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		const start = Point(x, 0);
		const finish = Point(x, map.height);
		camera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}

	// Draw the horizontal grid
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = Point(0, y);
		const finish = Point(map.width, y);
		camera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}
}

function renderMap(selfPlayer: ClientPlayer) {
	// Draw facilities
	const allyFacilityBundles = map.facilities.filter(fac => fac.team == selfPlayer.team);
	const enemyFacilityBundles = map.facilities.filter(fac => fac.team != selfPlayer.team);

	for (const bundle of allyFacilityBundles) {
		camera.fillRect(bundle.base, rensets.facilities.ally.base);
		camera.fillRect(bundle.command, rensets.facilities.ally.command);
		for (const briefing of bundle.briefings) {
			camera.fillRect(briefing, rensets.facilities.ally.pickup);
		}

		for (const outpost of bundle.outposts) {
			camera.fillRect(outpost, rensets.facilities.ally.outpost);
		}
		camera.fillRect(bundle.armory, rensets.facilities.ally.armory);
		camera.fillRect(bundle.intel, rensets.facilities.ally.intel);
	}

	for (const bundle of enemyFacilityBundles) {
		camera.fillRect(bundle.base, rensets.facilities.enemy.base);
		camera.fillRect(bundle.command, rensets.facilities.enemy.command);
		for (const briefing of bundle.briefings) {
			camera.fillRect(briefing, rensets.facilities.enemy.pickup);
		}

		for (const outpost of bundle.outposts) {
			camera.fillRect(outpost, rensets.facilities.enemy.outpost);
		}
		camera.fillRect(bundle.armory, rensets.facilities.enemy.armory);
		camera.fillRect(bundle.intel, rensets.facilities.enemy.intel);
	}

	// Draw death rects
	for (const deathRect of map.deathRects) {
		camera.fillRect(deathRect, rensets.death.color);
	}

	// Draw death circles
	for (const deathCircle of map.deathCircles) {
		camera.fillCircle(deathCircle, rensets.death.color);
	}

	// Draw safe zone
	camera.fillCircle(map.safeZone, rensets.safe.color);

	// Draw map boundaries
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	camera.outlineRect(mapRect, rensets.mapBorder.color, rensets.mapBorder.width);
}

function renderPlayers(state: SafeState, selfPlayer: ClientPlayer) {
	for (const player of state.playerMap.values()) {
		let color: Color;

		if (player.id == state.self) {
			color = rensets.players.self;
		} else if (player.team == selfPlayer.team) {
			color = rensets.players.allies;
		} else {
			color = rensets.players.enemies;
		}

		camera.fillCircle(player.position, color);
	}
}

function renderChessboard(state: SafeState) {
	const padding = 20;
	const squareSize = 50;
	const boardSize = squareSize*8;
	const windowWidth = 600;
	const windowHeight = boardSize + (padding*2);
	
	const cb = rensets.chessboard;
	const middleX = state.screen.width/2;
	const middleY = state.screen.height/2;

	const topLeftX = middleX - windowWidth/2;
	const topLeftY = middleY - windowHeight/2;
	const bottomRightX = middleX + windowWidth/2;
	const bottomRightY = middleY + windowHeight/2;

	// Draw window
	const windowRect = Rect(Point(topLeftX, topLeftY), Point(bottomRightX, bottomRightY));
	canvas.fillRect(windowRect, cb.windowInside);
	canvas.outlineRect(windowRect, cb.windowOutline, 5);

	// Draw board squares
	const boardTopLeftX = topLeftX + padding;
	const boardTopLeftY = topLeftY + padding;
	for (let row = 0 ; row < 8 ; row++) {
		for (let col = 0 ; col < 8 ; col++) {
			const color = (row+col) % 2 == 0 ? cb.boardLight : cb.boardDark;
			const squareTLX = boardTopLeftX + (col*squareSize);
			const squareTLY = boardTopLeftY + (row*squareSize);
			const squareTL = Point(squareTLX, squareTLY);
			const squareRect = Rect(squareTL, Point(squareTLX+squareSize, squareTLY+squareSize));
			canvas.fillRect(squareRect, color);

			const cell = state.teamBoard[row][col];
			if (cell) {
				if (cell.piece == ChessPiece.KING) {
					renderKing(squareTL, squareSize, cell.team);
				} else if (cell.piece == ChessPiece.QUEEN) {
					renderQueen(squareTL, squareSize, cell.team);
				} else if (cell.piece == ChessPiece.ROOK) {
					renderRook(squareTL, squareSize, cell.team);
				} else if (cell.piece == ChessPiece.BISHOP) {
					renderBishop(squareTL, squareSize, cell.team);
				} else if (cell.piece == ChessPiece.KNIGHT) {
					renderKnight(squareTL, squareSize, cell.team);
				} else if (cell.piece == ChessPiece.PAWN) {
					renderPawn(squareTL, squareSize, cell.team);
				}
			}
		}
	}

	// Draw board outline
	const boardRect = Rect(Point(boardTopLeftX, boardTopLeftY), Point(topLeftX+boardSize+padding, topLeftY+boardSize+padding));
	canvas.outlineRect(boardRect, cb.boardOutline, 2);
}

function renderKing(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.chessboard.pieceColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const bottomTopLeft = Point(middleX-(width*3/8), middleY);
	const bottomBottomRight = Point(middleX+(width*3/8), middleY+(width*3/8));
	canvas.fillRect(Rect(bottomTopLeft, bottomBottomRight), color);

	const crossVerticalTopLeft = Point(middleX-(width/16), middleY-(width*3/8));
	const crossVerticalBottomRight = Point(middleX+(width/16), middleY+(width/8));
	canvas.fillRect(Rect(crossVerticalTopLeft, crossVerticalBottomRight), color);

	const crossHorizontalTopLeft = Point(middleX-(width*3/16), middleY-(width*2/8));
	const crossHorizontalBottomRight = Point(middleX+(width*3/16), middleY-(width*1/8));
	canvas.fillRect(Rect(crossHorizontalTopLeft, crossHorizontalBottomRight), color);
}

function renderQueen(topLeft: Point, width: number, team: TeamName) {
	// TODO
}

function renderRook(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.chessboard.pieceColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const baseTopLeft = Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = Point(middleX+(width/3), middleY+(width/3));
	canvas.fillRect(Rect(baseTopLeft, baseBottomRight), color);

	const stemTopLeft = Point(middleX-(width/12), middleY - (width*3/8));
	const stemBottomRight = Point(middleX+(width/12), middleY + (width/4));
	canvas.fillRect(Rect(stemTopLeft, stemBottomRight), color);

	const barTopLeft = Point(middleX-(width/3), middleY-(width/4));
	const barBottomRight = Point(middleX+(width/3), middleY-(width/12));
	canvas.fillRect(Rect(barTopLeft, barBottomRight), color);

	const leftTopLeft = Point(middleX-(width/3), middleY-(width*3/8));
	const leftBottomRight = Point(middleX-(width/6), middleY-(width/12));
	canvas.fillRect(Rect(leftTopLeft, leftBottomRight), color);

	const rightTopLeft = Point(middleX+(width/6), middleY-(width*3/8));
	const rightBottomRight = Point(middleX+(width/3), middleY-(width/12));
	canvas.fillRect(Rect(rightTopLeft, rightBottomRight), color);
}

function renderBishop(topLeft: Point, width: number, team: TeamName) {
	// TODO
}

function renderKnight(topLeft: Point, width: number, team: TeamName) {
	// TODO
}

function renderPawn(topLeft: Point, width: number, team: TeamName) {
	const color = rensets.chessboard.pieceColor[team];
	const topLeftX = topLeft.x;
	const topLeftY = topLeft.y;

	const middleX = topLeftX+(width/2);
	const middleY = topLeftY+(width/2);

	const topCircle = Circle(Point(middleX, middleY - (width/6)), width/8);
	canvas.fillCircle(topCircle, color);

	const stemTopLeft = Point(middleX-(width/16), middleY - (width/6));
	const stemBottomRight = Point(middleX+(width/16), middleY + (width/4));
	canvas.fillRect(Rect(stemTopLeft, stemBottomRight), color);

	const baseTopLeft = Point(middleX-(width/3), middleY+(width/8));
	const baseBottomRight = Point(middleX+(width/3), middleY+(width/3));
	canvas.fillRect(Rect(baseTopLeft, baseBottomRight), color);
}

export default render;
