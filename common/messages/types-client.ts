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

type ClientMessage = KeysMessage;
export type ClientMessageWithId = ClientMessage & { id: string }
