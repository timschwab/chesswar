import { AbstractMessage } from "./types-base.ts";

export enum ServerMessageTypes {
	PLAYER_INIT = "player-init",
	STATE = "state"
}

export type PlayerInitMessagePayload = {
	id: string
}
type PlayerInitMessage = AbstractMessage<ServerMessageTypes.PLAYER_INIT, PlayerInitMessagePayload>;


export type StateMessagePayload = {
	player: string,
	position: {
		x: number,
		y: number
	}
}[];
type StateMessage = AbstractMessage<ServerMessageTypes.STATE, StateMessagePayload>;

export type ServerMessage = PlayerInitMessage | StateMessage;
