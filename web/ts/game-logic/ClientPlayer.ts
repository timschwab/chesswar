import { ChesswarId, PlayerAction, PlayerRole, TeamName } from "../../../common/data-types/base.ts";
import { SerializedClientPlayer } from "../../../common/data-types/client.ts";
import { Circle } from "../../../common/shapes/Circle.ts";

interface ClientPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	actionOption: PlayerAction,
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
