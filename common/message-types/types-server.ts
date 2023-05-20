import { BriefingBundle, ChessBoard, ChesswarId } from "../data-types/types-base.ts";
import { ClientPlayer } from "../data-types/types-client.ts";
import { AbstractMessage } from "./types-base.ts";

export enum ServerMessageTypes {
	PLAYER_INIT = "player-init",
	STATE = "state",
	TEAM = "team"
}

export type PlayerInitMessagePayload = {
	id: ChesswarId
}
type PlayerInitMessage = AbstractMessage<ServerMessageTypes.PLAYER_INIT, PlayerInitMessagePayload>;

export interface StateMessagePayload {
	players: ClientPlayer[]
}
type StateMessage = AbstractMessage<ServerMessageTypes.STATE, StateMessagePayload>;

export interface TeamMessagePayload {
	board: ChessBoard,
	briefings: BriefingBundle
}
export type TeamMessage = AbstractMessage<ServerMessageTypes.TEAM, TeamMessagePayload>;

export type ServerMessage = PlayerInitMessage | StateMessage | TeamMessage;
