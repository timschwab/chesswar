import { ChesswarId } from "../data-types/types-base.ts";
import { MovementState } from "../data-types/types-server.ts";
import { AbstractMessage } from "./types-base.ts";

export enum ClientMessageTypes {
	MOVE = "move",
	COMMAND = "command"
}

export type MoveMessagePayload = MovementState;
type MoveMessage = AbstractMessage<ClientMessageTypes.MOVE, MoveMessagePayload>;

export type CommandMessagePayload = null;
type CommandMessage = AbstractMessage<ClientMessageTypes.COMMAND, CommandMessagePayload>;

export type ClientMessage = MoveMessage | CommandMessage;
export type ClientMessageWithId = ClientMessage & { id: ChesswarId }
