import { Circle, Vector } from "../common/data-types/shapes.ts";
import { TeamName } from "../common/data-types/types-base.ts";
import map from "../common/map.ts";
import { gameEngine } from "../common/settings.ts";
import { ServerPlayerPhysics } from "./state.ts";

export function spawnPlayer(team: TeamName): ServerPlayerPhysics {
	const startChoices = map.starts[team];
	const start = startChoices[Math.floor(Math.random()*startChoices.length)];

	return {
		acceleration: Vector(0, 0),
		speed: Vector(0, 0),
		position: Circle(start, gameEngine.playerRadius)
	};
}
