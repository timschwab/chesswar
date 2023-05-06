import { ChesswarId } from "../../common/data-types/types-base.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";

interface Screen {
	width: number,
	height: number
}

export type PlayerMap = Map<ChesswarId, ClientPlayer>;

interface UnsafeState {
	screen: Screen | undefined,
	self: ChesswarId | undefined,
	playerMap: PlayerMap | undefined
}

const data: UnsafeState = {
	screen: undefined,
	self: undefined,
	playerMap: undefined
};

export default { data };
