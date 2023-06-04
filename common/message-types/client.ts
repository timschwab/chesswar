import { BriefingName, ChesswarId } from "../data-types/base.ts";
import { ChessMove } from "../data-types/chess.ts";
import { MovementState } from "../data-types/server.ts";
import { AbstractMessage } from "./base.ts";

export enum ClientMessageTypes {
	MOVE = "move",
	COMMAND = "command",
	GENERAL_ORDERS = "general-orders",
	PING = "ping"
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

export type PingMessagePayload = null;
type PingMessage = AbstractMessage<ClientMessageTypes.PING, PingMessagePayload>;

export type ClientMessage = MoveMessage | CommandMessage | GeneralOrdersMessage | PingMessage;
export type ClientMessageWithId = ClientMessage & { id: ChesswarId }
