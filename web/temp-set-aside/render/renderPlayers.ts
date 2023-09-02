import { Color } from "../../../common/colors.ts";
import { PlayerRole } from "../../../common/data-types/base.ts";
import { gameEngine, rensets } from "../../../common/settings.ts";
import { Circle } from "../../../common/shapes/Circle.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { TextAlign } from "../canvas/CWCanvas.ts";
import canvas from "../canvas/canvas.ts";
import { Diff } from "../diffStore.ts";
import { ClientPlayer, SafeState } from "../state.ts";
import { cameraTopLeft } from "./renderUtils.ts";

interface PlayerCoordBundle {
	playerPos: Circle,
	playerColor: Color,
	deathCounter: Rect,
	name: Rect
}

export function clearRemovedPlayers(state: SafeState) {
	let selfPos = state.self.position.lastSeen();
	if (selfPos == null) {
		selfPos = state.self.position.value();
	}
	if (selfPos == null) {
		throw "Ughhhhhhh";
	}

	const cameraTL = cameraTopLeft(state.screen, selfPos.center);
	const cameraRect = new Rect(cameraTL, cameraTL.add(state.screen.rightBottom));

	let player;
	while ((player = state.removedPlayers.dequeue()) != null) {
		const playerPos = player.position.value();
		if (playerPos != null) {
			clearPlayer(state, cameraRect, player, playerPos);
		}
	}
}

// For the time being, we still redraw players every frame.
// It seems not so hard at first, but I couldn't find a good way to compute the needed redraws.
// The hard part is that players can overlap one another.
export function renderPlayers(state: SafeState, diff: Diff<Circle>) {
	if (diff.prev == null) {
		newSelf(state, diff.cur.center);
	} else {
		selfDiff(state, diff.prev.center, diff.cur.center);
	}
}

function newSelf(state: SafeState, selfPos: Point) {
	const cameraTL = cameraTopLeft(state.screen, selfPos);
	const cameraRect = new Rect(cameraTL, cameraTL.add(state.screen.rightBottom));

	for (const player of state.playerMap.values()) {
		const playerPos = player.position.value();
		if (playerPos == null) {
			throw "bad times";
		}
		drawPlayer(state, cameraRect, player, playerPos);
	}
}

function selfDiff(state: SafeState, prev: Point, cur: Point) {
	const prevCameraTL = cameraTopLeft(state.screen, prev);
	const prevCameraRect = new Rect(prevCameraTL, prevCameraTL.add(state.screen.rightBottom));
	const curCameraTL = cameraTopLeft(state.screen, cur);
	const curCameraRect = new Rect(curCameraTL, curCameraTL.add(state.screen.rightBottom));

	// Clear prev players
	for (const player of state.playerMap.values()) {
		const playerPos = player.position.lastSeen();
		if (player.id == state.selfId) {
			// Since we are in the iterator consuming the self diffs, self will never have diffs
			// This is def a hack, because my current abstractions don't allow for graceful handling of this.
			clearPlayer(state, prevCameraRect, player, new Circle(prev, gameEngine.physics[PlayerRole.TANK].radius));
		} else if (playerPos == null) {
			// Never saw this player before or it hasn't changed, don't need to clear anything
		} else {
			clearPlayer(state, prevCameraRect, player, playerPos);
		}
		player.position.markAsRead();
	}

	// Render cur players
	for (const player of state.playerMap.values()) {
		const playerPos = player.position.value();
		if (playerPos == null) {
			throw "bad times";
		}
		drawPlayer(state, curCameraRect, player, playerPos);
	}
}

function drawPlayer(state: SafeState, cameraRect: Rect, player: ClientPlayer, playerPos: Circle) {
	const coords = getPlayerCoords(state, cameraRect, player, playerPos);

	canvas.FIELD_PLAYERS.fillCircle(coords.playerPos, coords.playerColor);

	if (player.deathCounter > 0) {
		canvas.FIELD_PLAYERS.text(
			coords.deathCounter,
			TextAlign.CENTER,
			String(player.deathCounter),
			rensets.players.deathCounter.font,
			rensets.players.deathCounter.color
		);
	}

	canvas.FIELD_PLAYERS.text(
		coords.name,
		TextAlign.CENTER,
		player.id.slice(0, 4),
		rensets.players.name.font,
		rensets.players.name.color
	);
}

function clearPlayer(state: SafeState, cameraRect: Rect, player: ClientPlayer, playerPos: Circle) {
	const prevCoords = getPlayerCoords(state, cameraRect, player, playerPos);
	canvas.FIELD_PLAYERS.clearRect(prevCoords.playerPos.enclosingRect().expand(1));
	canvas.FIELD_PLAYERS.clearRect(prevCoords.name);
}

function getPlayerCoords(state: SafeState, cameraRect: Rect, player: ClientPlayer, playerPos: Circle): PlayerCoordBundle {
	const color = rensets.players.teamColor[player.team];

	const isEnemy = player.team != state.self.team;
	const isSoldierOrTank = player.role == PlayerRole.SOLDIER || player.role == PlayerRole.TANK;
	if (state.self.role == PlayerRole.TANK && isEnemy && isSoldierOrTank) {
		playerPos = playerPos.clampInside(cameraRect);
	}

	const nameRect = playerPos.enclosingRect().add(new Point(0, playerPos.radius+10)).expand(10);
	
	return {
		playerPos: playerPos.subtract(cameraRect.leftTop),
		playerColor: color,
		deathCounter: playerPos.enclosingRect().subtract(cameraRect.leftTop),
		name: nameRect.subtract(cameraRect.leftTop)
	};
}
