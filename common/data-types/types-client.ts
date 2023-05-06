import { Point } from "./structures.ts";
import { ChesswarId } from "./types-base.ts";

export interface ClientPlayer {
	id: ChesswarId,
	position: Point
}
