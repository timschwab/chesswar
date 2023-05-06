import { ChesswarId } from "../data-types/types-base.ts";
import { ClientPlayer } from "../data-types/types-client.ts";
import { AbstractMessage } from "./types-base.ts";

export enum ServerMessageTypes {
	PLAYER_INIT = "player-init",
	STATE = "state"
}

export type PlayerInitMessagePayload = {
	id: ChesswarId
}
type PlayerInitMessage = AbstractMessage<ServerMessageTypes.PLAYER_INIT, PlayerInitMessagePayload>;


export type StateMessagePayload = ClientPlayer[];
type StateMessage = AbstractMessage<ServerMessageTypes.STATE, StateMessagePayload>;

export type ServerMessage = PlayerInitMessage | StateMessage;