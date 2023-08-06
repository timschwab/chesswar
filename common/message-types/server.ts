import { ChesswarId, DeathCause, PlayerAction, Victory } from "../data-types/base.ts";
import { CarryLoad } from "../data-types/carryLoad.ts";
import { ChessBoard } from "../data-types/chess.ts";
import { SerializedClientPlayerState } from "../data-types/client.ts";
import { BriefingBundle } from "../data-types/facility.ts";
import { ServerStats } from "../data-types/server.ts";
import { AbstractMessage } from "./base.ts";

export enum ServerMessageTypes {
	PLAYER_INIT = "player-init",
	STATE = "state",
	TEAM = "team",
	ACTION_COMPLETED = "action-completed",
	CARRYING = "carrying",
	DEATH = "death",
	PONG = "pong",
	STATS = "stats"
}

export interface PlayerInitMessagePayload {
	id: ChesswarId
}
export type PlayerInitMessage = AbstractMessage<ServerMessageTypes.PLAYER_INIT, PlayerInitMessagePayload>;

export interface StateMessagePayload {
	players: SerializedClientPlayerState[],
	victory: Victory,
	newGameCounter: number
}
export type StateMessage = AbstractMessage<ServerMessageTypes.STATE, StateMessagePayload>;

export interface TeamMessagePayload {
	board: ChessBoard,
	briefings: BriefingBundle,
	enemyBriefings: BriefingBundle
}
export type TeamMessage = AbstractMessage<ServerMessageTypes.TEAM, TeamMessagePayload>;

export type ActionCompletedMessagePayload = PlayerAction;
export type ActionCompletedMessage = AbstractMessage<ServerMessageTypes.ACTION_COMPLETED, ActionCompletedMessagePayload>;

export type CarryingMessagePayload = CarryLoad;
export type CarryingMessage = AbstractMessage<ServerMessageTypes.CARRYING, CarryingMessagePayload>;

export type DeathMessagePayload = DeathCause;
export type DeathMessage = AbstractMessage<ServerMessageTypes.DEATH, DeathMessagePayload>;

export type PongMessagePayload = null;
export type PongMessage = AbstractMessage<ServerMessageTypes.PONG, PongMessagePayload>;

export type StatsMessagePayload = ServerStats;
export type StatsMessage = AbstractMessage<ServerMessageTypes.STATS, StatsMessagePayload>;

export type ServerMessage =
	PlayerInitMessage |
	StateMessage |
	TeamMessage |
	ActionCompletedMessage |
	CarryingMessage |
	DeathMessage |
	PongMessage |
	StatsMessage;
