import { CarryLoadType } from "../common/data-types/server.ts";
import { Circle, Vector } from "../common/data-types/shapes.ts";
import map from "../common/map.ts";
import { ServerMessageTypes } from "../common/message-types/server.ts";
import { gameEngine } from "../common/settings.ts";
import socket from "./socket.ts";
import { ServerPlayer } from "./state.ts";

export function spawnPlayer(player: ServerPlayer): void {
	const role = gameEngine.startingRole;
	const radius = gameEngine.physics[role].radius;
	const mass = gameEngine.physics[role].mass;

	const startChoices = map.starts[player.team];
	const start = startChoices[Math.floor(Math.random()*startChoices.length)];
	
	player.role = role;
	player.physics = {
		mass: mass,
		speed: Vector(0, 0),
		position: Circle(start, radius)
	};

	player.carrying = {
		type: CarryLoadType.EMPTY,
		load: null
	};
	socket.sendOne(player.id, {
		type: ServerMessageTypes.CARRYING,
		payload: player.carrying
	});
}
