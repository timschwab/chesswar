import { ChesswarId } from "../data-types/types-base.ts";
import { AbstractMessage } from "./types-base.ts";

export enum ClientMessageTypes {
	MOVE = "move"
}

export type MoveMessagePayload = {
	left: boolean,
	right: boolean,
	up: boolean,
	down: boolean
}
type MoveMessage = AbstractMessage<ClientMessageTypes.MOVE, MoveMessagePayload>;

export type ClientMessage = MoveMessage;
export type ClientMessageWithId = ClientMessage & { id: ChesswarId }
