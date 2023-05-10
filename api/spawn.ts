import { Circle, Vector } from "../common/data-types/shapes.ts";
import map from "../common/map.ts";
import { gameEngine } from "../common/settings.ts";
import { ServerPlayer } from "./state.ts";

export function spawnPlayer(player: ServerPlayer): void {
	const role = gameEngine.startingRole;
	const radius = gameEngine.physics[role].playerRadius;
	const startChoices = map.starts[player.team];
	const start = startChoices[Math.floor(Math.random()*startChoices.length)];
	
	player.role = role;
	player.physics = {
		acceleration: Vector(0, 0),
		speed: Vector(0, 0),
		position: Circle(start, radius)
	};
}
