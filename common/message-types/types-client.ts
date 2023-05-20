import { BriefingName, ChessMove, ChesswarId } from "../data-types/types-base.ts";
import { MovementState } from "../data-types/types-server.ts";
import { AbstractMessage } from "./types-base.ts";

export enum ClientMessageTypes {
	MOVE = "move",
	COMMAND = "command",
	GENERAL_ORDERS = "general-orders"
}

export type MoveMessagePayload = MovementState;
type MoveMessage = AbstractMessage<ClientMessageTypes.MOVE, MoveMessagePayload>;

export type CommandMessagePayload = null;
type CommandMessage = AbstractMessage<ClientMessageTypes.COMMAND, CommandMessagePayload>;

export interface GeneralOrdersMessagePayload {
	briefing: BriefingName
	move: ChessMove
}
type GeneralOrdersMessage = AbstractMessage<ClientMessageTypes.GENERAL_ORDERS, GeneralOrdersMessagePayload>;

export type ClientMessage = MoveMessage | CommandMessage | GeneralOrdersMessage;
export type ClientMessageWithId = ClientMessage & { id: ChesswarId }
