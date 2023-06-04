import { BriefingBundle, ChessBoard, ChesswarId, Victory } from "../data-types/types-base.ts";
import { ClientPlayer } from "../data-types/types-client.ts";
import { AbstractMessage } from "./types-base.ts";

export enum ServerMessageTypes {
	PLAYER_INIT = "player-init",
	STATE = "state",
	TEAM = "team",
	PONG = "pong"
}

export interface PlayerInitMessagePayload {
	id: ChesswarId
}
export type PlayerInitMessage = AbstractMessage<ServerMessageTypes.PLAYER_INIT, PlayerInitMessagePayload>;

export interface StateMessagePayload {
	players: ClientPlayer[],
	victory: Victory
}
export type StateMessage = AbstractMessage<ServerMessageTypes.STATE, StateMessagePayload>;

export interface TeamMessagePayload {
	board: ChessBoard,
	briefings: BriefingBundle
}
export type TeamMessage = AbstractMessage<ServerMessageTypes.TEAM, TeamMessagePayload>;

export type PongMessagePayload = null;
export type PongMessage = AbstractMessage<ServerMessageTypes.PONG, PongMessagePayload>;

export type ServerMessage = PlayerInitMessage | StateMessage | TeamMessage | PongMessage;
