import { ChesswarId, MovementState } from "../data-types/base.ts";
import { ChessMove } from "../data-types/chess.ts";
import { BriefingName } from "../data-types/facility.ts";
import { AbstractMessage } from "./base.ts";

export enum ClientMessageTypes {
	MOVE = "move",
	ACTION = "action",
	GENERAL_ORDERS = "general-orders",
	PING = "ping"
}

export type MoveMessagePayload = MovementState;
type MoveMessage = AbstractMessage<ClientMessageTypes.MOVE, MoveMessagePayload>;

export type ActionMessagePayload = null;
type ActionMessage = AbstractMessage<ClientMessageTypes.ACTION, ActionMessagePayload>;

export interface GeneralOrdersMessagePayload {
	briefing: BriefingName
	move: ChessMove
}
type GeneralOrdersMessage = AbstractMessage<ClientMessageTypes.GENERAL_ORDERS, GeneralOrdersMessagePayload>;

export type PingMessagePayload = null;
type PingMessage = AbstractMessage<ClientMessageTypes.PING, PingMessagePayload>;

export type ClientMessage = MoveMessage | ActionMessage | GeneralOrdersMessage | PingMessage;
export type ClientMessageWithId = ClientMessage & { id: ChesswarId }
