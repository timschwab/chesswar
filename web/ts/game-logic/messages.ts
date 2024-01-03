import { DeathCause, PlayerAction, PlayerRole } from "../../../common/data-types/base.ts";
import { CarryingMessagePayload, PlayerInitMessagePayload, ServerMessage, ServerMessageTypes, StateMessagePayload, StatsMessagePayload, TeamMessagePayload } from "../../../common/message-types/server.ts";
import { rensets } from "../../../common/settings.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { Text, TextAlign } from "../../../common/shapes/Text.ts";
import { assertNever } from "../../../common/typescript-utils.ts";
import audioPlayer from "../audio/audioPlayer.ts";
//import { playerLayer } from "../scene/scene.ts";
//import { ui } from "../ui/ui.ts";
import { ClientPlayer, deserializeClientPlayer } from "./ClientPlayer.ts";
import { state } from "./state.ts";
//import { handleSelfPosition } from "./camera.ts";
//import { reportPong } from "./pingManager.ts";
//import { state } from "./state.ts";
//import { recordPlayersOnline, recordServerStats } from "./statsManager.ts";

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
		handlePong(message.payload);
	} else if (message.type == ServerMessageTypes.STATS) {
		handleServerStats(message.payload);
	}
}

function handlePlayerInit(payload: PlayerInitMessagePayload) {
	state.selfId = payload.id;
}

function handleState(payload: StateMessagePayload) {
	const deserialized = payload.players.map(deserializeClientPlayer);

	const selfPlayer = deserialized.find(player => player.id == state.selfId);
	if (!selfPlayer) {
		console.warn("Could not find self player", {
			players: deserialized,
			selfId: state.selfId
		});
		return;
	}

	state.selfPlayer = selfPlayer;
	state.players = deserialized;

	/*handleSelfPosition(selfPlayer.position.center);
	ui.teamRole.setTeam(selfPlayer.team);
	ui.teamRole.setRole(selfPlayer.role);
	ui.actionOption.setActionOption(selfPlayer.actionOption);

	const isGeneral = (selfPlayer.role == PlayerRole.GENERAL);
	ui.generalWindow.setTeam(selfPlayer.team);
	ui.generalWindow.setShow(isGeneral);

	ui.miniChessboard.setTeam(selfPlayer.team);

	const playerShapes = deserialized.map(player => {
		const geo = player.position;
		const color = rensets.players.teamColor[player.team];

		const texts = [];
		const nameRect = new Rect(new Point(geo.center.x-50, geo.center.y+geo.radius+10), new Point(geo.center.x+50, geo.center.y+geo.radius+30));
		const nameText = new Text(nameRect, player.id.slice(0, 4), TextAlign.CENTER, rensets.players.name.font, rensets.players.name.color);
		texts.push(nameText);

		if (player.deathCounter > 0) {
			const textRect = geo.enclosingRect().expand(5);
			const counterText = new Text(textRect, String(player.deathCounter), TextAlign.CENTER, rensets.players.deathCounter.font, rensets.players.deathCounter.color);
			texts.push(counterText);
		}

		return {
			circles: Shape.from(geo, color, shouldClamp(selfPlayer, player)),
			texts: texts
		};
	});

	const bundle = {
		circles: playerShapes.map(elem => elem.circles),
		texts: playerShapes.flatMap(elem => elem.texts)
	};

	playerLayer.setShapes(bundle);
	ui.victory.setVictory(payload.victory);
	ui.victory.setNewGameTicks(payload.newGameCounter);
	recordPlayersOnline(payload.players.length);*/
}

function shouldClamp(selfPlayer: ClientPlayer, otherPlayer: ClientPlayer): boolean {
	if (selfPlayer.role != PlayerRole.TANK) {
		return false;
	}

	if (selfPlayer.team == otherPlayer.team) {
		return false;
	}

	if (otherPlayer.role == PlayerRole.GENERAL) {
		return false;
	} else if (otherPlayer.role == PlayerRole.SOLDIER) {
		return true;
	} else if (otherPlayer.role == PlayerRole.TANK) {
		return true;
	} else if (otherPlayer.role == PlayerRole.OPERATIVE) {
		return false;
	}

	assertNever(otherPlayer.role);
	return false;
}

function handleTeam(payload: TeamMessagePayload) {
	/*ui.generalWindow.setTeamBoard(payload.board);
	ui.generalWindow.setBriefings(payload.briefings);
	ui.generalWindow.setEnemyBriefings(payload.enemyBriefings);

	ui.miniChessboard.setTeamBoard(payload.board);*/
}

function handleCompletedAction(payload: PlayerAction) {
	if (payload == PlayerAction.GRAB_ORDERS) {
		audioPlayer.grabOrders();
	} else if (payload == PlayerAction.COMPLETE_ORDERS) {
		audioPlayer.completeOrders();
	}
}

function handleCarrying(payload: CarryingMessagePayload) {
	/*ui.miniChessboard.setCarrying(payload);*/
}

function handleDeath(payload: DeathCause) {
	if (payload == DeathCause.MINEFIELD) {
		audioPlayer.minefieldDeath();
	} else if (payload == DeathCause.TANK) {
		audioPlayer.tankDeath();
	}
}

function handlePong(_payload: null) {
	/*reportPong();*/
}

function handleServerStats(payload: StatsMessagePayload) {
	/*recordServerStats(payload);*/
}
