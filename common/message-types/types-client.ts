import { ChesswarId } from "../data-types/types-base.ts";
import { AbstractMessage } from "./types-base.ts";

export enum ClientMessageTypes {
	MOVE = "move",
	SWITCH = "switch"
}

export type MoveMessagePayload = {
	left: boolean,
	right: boolean,
	up: boolean,
	down: boolean
}
type MoveMessage = AbstractMessage<ClientMessageTypes.MOVE, MoveMessagePayload>;

export type SwitchMessagePayload = null;
type SwitchMessage = AbstractMessage<ClientMessageTypes.SWITCH, SwitchMessagePayload>

export type ClientMessage = MoveMessage | SwitchMessage;
export type ClientMessageWithId = ClientMessage & { id: ChesswarId }
