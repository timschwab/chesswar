import { Point, Vector } from "../common/data-types/structures.ts";

export interface ServerPlayer {
	id: string,
	acceleration: Vector,
	speed: Vector,
	position: Point
}

const state = {
	playerMap: new Map<string, ServerPlayer>()
};

export default state;
