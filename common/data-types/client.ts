import { Circle, SerializedCircle } from "../shapes/Circle.ts";
import { ChesswarId, PlayerAction, PlayerRole, TeamName } from "./base.ts";

export interface SerializedClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	actionOption: PlayerAction | null,
	position: SerializedCircle,
	deathCounter: number
}

export interface ClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	actionOption: PlayerAction | null,
	position: Circle,
	deathCounter: number
}

export function deserializeClientPlayer(player: SerializedClientPlayer): ClientPlayer {
	return {
		id: player.id,
		team: player.team,
		role: player.role,
		actionOption: player.actionOption,
		position: Circle.deserialize(player.position).floor(),
		deathCounter: player.deathCounter
	};
}
