import { ChesswarId } from "../data-types/types-base.ts";
import { AbstractMessage } from "./types-base.ts";

export enum ClientMessageTypes {
	KEYS = "keys"
}

export type KeysMessagePayload = {
	left: boolean,
	right: boolean,
	up: boolean,
	down: boolean
}
type KeysMessage = AbstractMessage<ClientMessageTypes.KEYS, KeysMessagePayload>;

export type ClientMessage = KeysMessage;
export type ClientMessageWithId = ClientMessage & { id: ChesswarId }
