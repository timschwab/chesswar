import { TeamName } from "../common/data-types/base.ts";
import { CarryLoad, CarryLoadType } from "../common/data-types/carryLoad.ts";
import map from "../common/map.ts";
import { ServerMessageTypes } from "../common/message-types/server.ts";
import { gameEngine } from "../common/settings.ts";
import { transposePoint } from "../common/shapes/transpose.ts";
import { Circle, Point, Vector } from "../common/shapes/types.ts";
import socket from "./socket.ts";
import { ServerPlayer } from "./state.ts";

export function spawnPlayer(player: ServerPlayer): void {
	const role = gameEngine.startingRole;
	const radius = gameEngine.physics[role].radius;
	const mass = gameEngine.physics[role].mass;

	const start = getStartPoint(player.team);
	player.role = role;
	player.physics = {
		mass: mass,
		speed: Vector(0, 0),
		position: Circle(start, radius)
	};

	setCarrying(player, null);

	player.deathCounter = gameEngine.deathTicks;
}

function getStartPoint(team: TeamName): Point {
	const startChoices = map.starts[team];
	const start = startChoices[Math.floor(Math.random()*startChoices.length)];

	const clumpingPoint = Point((Math.random()-0.5) * gameEngine.startingClump, (Math.random()-0.5) * gameEngine.startingClump);

	return transposePoint(start, clumpingPoint);
}

export function setCarrying(player: ServerPlayer, load: CarryLoad | null) {
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
