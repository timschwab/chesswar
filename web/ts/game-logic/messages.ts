import { DeathCause, PlayerAction } from "../../../common/data-types/base.ts";
import { CarryingMessagePayload, PlayerInitMessagePayload, ServerMessage, ServerMessageTypes, StateMessagePayload, StatsMessagePayload, TeamMessagePayload } from "../../../common/message-types/server.ts";
import { rensets } from "../../../common/settings.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import audioPlayer from "../audio/audioPlayer.ts";
import { playerLayer } from "../scene/scene.ts";
import { ui } from "../ui/ui.ts";
import { deserializeClientPlayer } from "./ClientPlayer.ts";
import { handleSelfPosition } from "./camera.ts";
import { state } from "./state.ts";

export function receiveMessage(message: ServerMessage): void {
	if (message.type == ServerMessageTypes.PLAYER_INIT) {
		handlePlayerInit(message.payload);
	} else if (message.type == ServerMessageTypes.STATE) {
		handleState(message.payload);
	} else if (message.type == ServerMessageTypes.TEAM) {
		handleTeam(message.payload);
	} else if (message.type == ServerMessageTypes.ACTION_COMPLETED) {
		handleCompletedAction(message.payload);
	} else if (message.type == ServerMessageTypes.CARRYING) {
		handleCarrying(message.payload);
	} else if (message.type == ServerMessageTypes.DEATH) {
		handleDeath(message.payload);
	} else if (message.type == ServerMessageTypes.PONG) {
		handlePong();
	} else if (message.type == ServerMessageTypes.STATS) {
		handleStats(message.payload);
	}
}

function handlePlayerInit(payload: PlayerInitMessagePayload) {
	state.selfId = payload.id;
}

function handleState(payload: StateMessagePayload) {
	const deserialized = payload.players.map(deserializeClientPlayer);

	for (const player of deserialized) {
		if (player.id == state.selfId) {
			handleSelfPosition(player.position.center);
			ui.teamRole.setTeam(player.team);
			ui.teamRole.setRole(player.role);
			ui.actionOption.setActionOption(player.actionOption);
		}
	}

	const playerShapes = deserialized.map(player => {
		const geo = player.position;
		const color = rensets.players.teamColor[player.team];

		return new Shape(geo, color);
	});

	playerLayer.setShapes(playerShapes);
}

function handleTeam(payload: TeamMessagePayload) {
	// Do something
}

function handleCompletedAction(action: PlayerAction) {
	// Do something
}

function handleCarrying(payload: CarryingMessagePayload) {
	// Do something
}

function handleDeath(cause: DeathCause) {
	if (cause == DeathCause.MINEFIELD) {
		audioPlayer.minefieldDeath();
	} else if (cause == DeathCause.TANK) {
		audioPlayer.tankDeath();
	}
}

function handlePong() {
	// Do something
}

function handleStats(payload: StatsMessagePayload) {
	// Do something
}
