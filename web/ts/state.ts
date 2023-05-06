import { Point } from "../../common/data-types/structures.ts";
import { ChesswarId } from "../../common/data-types/types-base.ts";

interface Screen {
	width: number,
	height: number
}

interface Player {
	id: ChesswarId,
	position: Point
}

type PlayerMap = Map<ChesswarId, Player>;

interface State {
	screen: Screen | undefined,
	self: ChesswarId | undefined,
	players: PlayerMap | undefined
}

const data: State = {
	screen: undefined,
	self: undefined,
	players: undefined
};

export default { data };
