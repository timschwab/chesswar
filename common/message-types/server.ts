import { ChesswarId, Victory } from "../data-types/base.ts";
import { ChessBoard } from "../data-types/chess.ts";
import { ClientPlayer } from "../data-types/client.ts";
import { BriefingBundle, ServerStats } from "../data-types/server.ts";
import { AbstractMessage } from "./base.ts";

export enum ServerMessageTypes {
	PLAYER_INIT = "player-init",
	STATE = "state",
	TEAM = "team",
	PONG = "pong",
	STATS = "stats"
}

export interface PlayerInitMessagePayload {
	id: ChesswarId
}
export type PlayerInitMessage = AbstractMessage<ServerMessageTypes.PLAYER_INIT, PlayerInitMessagePayload>;

export interface StateMessagePayload {
	players: ClientPlayer[],
	victory: Victory
}
export type StateMessage = AbstractMessage<ServerMessageTypes.STATE, StateMessagePayload>;

export interface TeamMessagePayload {
	board: ChessBoard,
	briefings: BriefingBundle
}
export type TeamMessage = AbstractMessage<ServerMessageTypes.TEAM, TeamMessagePayload>;

export type PongMessagePayload = null;
export type PongMessage = AbstractMessage<ServerMessageTypes.PONG, PongMessagePayload>;

export type StatsMessagePayload = ServerStats;
export type StatsMessage = AbstractMessage<ServerMessageTypes.STATS, StatsMessagePayload>;

export type ServerMessage = PlayerInitMessage | StateMessage | TeamMessage | PongMessage | StatsMessage;
