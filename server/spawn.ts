import { TeamName } from "../common/data-types/base.ts";
import { CarryLoad, CarryLoadType } from "../common/data-types/carryLoad.ts";
import { mapGeometry } from "../common/map/MapValues.ts";
import { ServerMessageTypes } from "../common/message-types/server.ts";
import { randomChoose, randomPointClump } from "../common/random.ts";
import { gameEngine } from "../common/settings.ts";
import { Circle } from "../common/shapes/Circle.ts";
import { Point } from "../common/shapes/Point.ts";
import { ZeroVector } from "../common/shapes/Zero.ts";
import { SocketManager } from "./SocketManager.ts";
import { ServerPlayer } from "./state.ts";

export function spawnPlayer(socket: SocketManager, player: ServerPlayer): void {
	const role = gameEngine.startingRole;
	const radius = gameEngine.physics[role].radius;
	const mass = gameEngine.physics[role].mass;

	const start = getStartPoint(player.team);
	player.role = role;
	player.physics = {
		mass: mass,
		speed: ZeroVector,
		position: new Circle(start, radius)
	};

	setCarrying(socket, player, null);

	player.deathCounter = gameEngine.deathTicks;
}

function getStartPoint(team: TeamName): Point {
	const startChoices = mapGeometry.teamBundles[team].starts;
	const start = randomChoose(startChoices);

	const clumpingPoint = randomPointClump(start, gameEngine.startingClump);

	return clumpingPoint;
}

export function setCarrying(socket: SocketManager, player: ServerPlayer, load: CarryLoad | null) {
	if (load == null) {
		load = {
			type: CarryLoadType.EMPTY,
			load: null
		}
	}

	player.carrying = load;
	socket.sendOne(player.id, {
		type: ServerMessageTypes.CARRYING,
		payload: player.carrying
	});
}
