import { Circle, Vector } from "../common/data-types/shapes.ts";
import map from "../common/map.ts";
import { gameEngine } from "../common/settings.ts";
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
		inputForce: player.physics.inputForce, // Keep the state of the input force
		speed: Vector(0, 0),
		position: Circle(start, radius)
	};
}
