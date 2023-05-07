import { Point, Vector } from "../common/data-types/structures.ts";
import { ChesswarId } from "../common/data-types/types-base.ts";

export interface ServerPlayer {
	id: ChesswarId,
	acceleration: Vector,
	speed: Vector,
	position: Point
}

interface ServerState {
	playerMap: Map<ChesswarId, ServerPlayer>
}

const state: ServerState = {
	playerMap: new Map<ChesswarId, ServerPlayer>()
};

export default state;
