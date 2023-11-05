import { ChesswarId, PlayerAction, PlayerRole, TeamName } from "../common/data-types/base.ts";
import { CarryLoad, CarryLoadType } from "../common/data-types/carryLoad.ts";
import { BriefingName } from "../common/data-types/facility.ts";
import map from "../common/map.ts";
import { ClientMessageTypes, ClientMessageWithId, GeneralOrdersMessagePayload, MoveMessagePayload } from "../common/message-types/client.ts";
import { ServerMessageTypes } from "../common/message-types/server.ts";
import { gameEngine } from "../common/settings.ts";
import { Circle } from "../common/shapes/Circle.ts";
import { ZeroCircle, ZeroVector } from "../common/shapes/Zero.ts";
import { makeMove } from "./chess.ts";
import socket from "./socket.ts";
import { setCarrying, spawnPlayer } from "./spawn.ts";
import { ServerPlayer, getState } from "./state.ts";

export function addPlayer(id: string): void {
	const state = getState();
	const team = newPlayerTeam();
	const newPlayer: ServerPlayer = {
		id,
		team,
		role: PlayerRole.SOLDIER,
		actionOption: PlayerAction.NONE,
		carrying: {
			type: CarryLoadType.EMPTY,
			load: null
		},
		movement: {
			left: false,
			right: false,
			up: false,
			down: false
		},
		physics: {
			speed: ZeroVector,
			mass: 0,
			position: ZeroCircle
		},
		deathCounter: 0
	}

	spawnPlayer(newPlayer);

	state.allPlayers.set(id, newPlayer);
	state[team].playerMap.set(id, newPlayer);

	socket.sendOne(id, {
		type: ServerMessageTypes.PLAYER_INIT,
		payload: {
			id: id
		}
	});
}

// Add them to the team with fewer players
function newPlayerTeam(): TeamName {
	const state = getState();
	if (state[TeamName.BLUE].playerMap.size > state[TeamName.RED].playerMap.size) {
		return TeamName.RED;
	} else {
		return TeamName.BLUE;
	}
}

export function removePlayer(id: string): void {
	const state = getState();
	try {
		const player = getPlayer(id);
		state.allPlayers.delete(id);
		state[player.team].playerMap.delete(id);
	} catch (err) {
		console.error(err);
	}
}

export function receiveMessage(message: ClientMessageWithId): void {
	const player = getPlayer(message.id);

	if (message.type == ClientMessageTypes.MOVE) {
		playerMove(player, message.payload);
	} else if (message.type == ClientMessageTypes.ACTION) {
		playerAction(player);
	} else if (message.type == ClientMessageTypes.GENERAL_ORDERS) {
		generalOrders(player, message.payload);
	} else if (message.type == ClientMessageTypes.PING) {
		pong(message.id);
	}
}

function getPlayer(id: string): ServerPlayer {
	const state = getState();
	const player = state.allPlayers.get(id);
	if (player) {
		return player;
	} else {
		throw new ReferenceError("Could not find player: " + id);
	}
}

function playerMove(player: ServerPlayer, keys: MoveMessagePayload): void {
	player.movement = keys;
}

function playerAction(player: ServerPlayer): void {
	const state = getState();
	if (player.actionOption == null) {
		// Do nothing
	} else if (player.actionOption == PlayerAction.BECOME_GENERAL) {
		becomeRole(player, PlayerRole.GENERAL);
		socket.sendOne(player.id, {
			type: ServerMessageTypes.ACTION_COMPLETED,
			payload: PlayerAction.BECOME_GENERAL
		});
	} else if (player.actionOption == PlayerAction.BECOME_SOLDIER) {
		becomeRole(player, PlayerRole.SOLDIER);
		socket.sendOne(player.id, {
			type: ServerMessageTypes.ACTION_COMPLETED,
			payload: PlayerAction.BECOME_SOLDIER
		});
	} else if (player.actionOption == PlayerAction.BECOME_TANK) {
		becomeRole(player, PlayerRole.TANK);
		socket.sendOne(player.id, {
			type: ServerMessageTypes.ACTION_COMPLETED,
			payload: PlayerAction.BECOME_TANK
		});
	} else if (player.actionOption == PlayerAction.BECOME_OPERATIVE) {
		becomeRole(player, PlayerRole.OPERATIVE);
		socket.sendOne(player.id, {
			type: ServerMessageTypes.ACTION_COMPLETED,
			payload: PlayerAction.BECOME_OPERATIVE
		});
	} else if (player.actionOption == PlayerAction.GRAB_ORDERS) {
		const briefing = whichBriefing(player);
		if (briefing == null) {
			throw new Error("Couldn't find the briefing");
		} else {
			const briefingMove = state[player.team].briefings[briefing];
			let carryLoad: CarryLoad;
			if (briefingMove == null) {
				carryLoad = {
					type: CarryLoadType.EMPTY,
					load: null
				};
			} else {
				carryLoad = {
					type: CarryLoadType.ORDERS,
					load: briefingMove
				};
			}

			setCarrying(player, carryLoad);
			socket.sendOne(player.id, {
				type: ServerMessageTypes.ACTION_COMPLETED,
				payload: PlayerAction.GRAB_ORDERS
			});
		}
	} else if (player.actionOption == PlayerAction.COMPLETE_ORDERS) {
		if (player.carrying.type == CarryLoadType.ORDERS) {
			makeMove(state.realBoard, player.carrying.load);
			setCarrying(player, null);
			socket.sendOne(player.id, {
				type: ServerMessageTypes.ACTION_COMPLETED,
				payload: PlayerAction.COMPLETE_ORDERS
			});
		}
	} else if (player.actionOption == PlayerAction.GATHER_INTEL) {
		const load: CarryLoad = {
			type: CarryLoadType.INTEL,
			load: structuredClone(state.realBoard)
		};
		setCarrying(player, load);
		socket.sendOne(player.id, {
			type: ServerMessageTypes.ACTION_COMPLETED,
			payload: PlayerAction.GATHER_INTEL
		});
	} else if (player.actionOption == PlayerAction.REPORT_INTEL) {
		if (player.carrying.type == CarryLoadType.INTEL) {
			state[player.team].teamBoard = player.carrying.load;
			setCarrying(player, null);
		}
		socket.sendOne(player.id, {
			type: ServerMessageTypes.ACTION_COMPLETED,
			payload: PlayerAction.REPORT_INTEL
		});
	} else if (player.actionOption == PlayerAction.CONDUCT_ESPIONAGE) {
		const oppositeTeam = player.team == TeamName.BLUE ? TeamName.RED : TeamName.BLUE;
		const load: CarryLoad = {
			type: CarryLoadType.ESPIONAGE,
			load: structuredClone(state[oppositeTeam].briefings)
		};
		setCarrying(player, load);
		socket.sendOne(player.id, {
			type: ServerMessageTypes.ACTION_COMPLETED,
			payload: PlayerAction.CONDUCT_ESPIONAGE
		});
	} else if (player.actionOption == PlayerAction.REPORT_ESPIONAGE) {
		if (player.carrying.type == CarryLoadType.ESPIONAGE) {
			state[player.team].enemyBriefings = player.carrying.load;
			setCarrying(player, null);
		}
		socket.sendOne(player.id, {
			type: ServerMessageTypes.ACTION_COMPLETED,
			payload: PlayerAction.REPORT_ESPIONAGE
		});
	}
}

function whichBriefing(player: ServerPlayer): null | BriefingName {
	const pos = player.physics.position;
	const facilityBundles = map.facilities.filter(fac => fac.team == player.team);

	for (const bundle of facilityBundles) {
		if (pos.inside(bundle.briefings[0])) {
			return BriefingName.ONE;
		} else if (pos.inside(bundle.briefings[1])) {
			return BriefingName.TWO;
		} else if (pos.inside(bundle.briefings[2])) {
			return BriefingName.THREE;
		}
	}

	return null;
}

function becomeRole(player: ServerPlayer, role: PlayerRole): void {
	player.role = role;
	const radius = gameEngine.physics[role].radius;
	const mass = gameEngine.physics[role].mass;

	player.physics.mass = mass;
	player.physics.position = new Circle(player.physics.position.center, radius);

	if (role == PlayerRole.GENERAL) {
		player.physics.speed = ZeroVector;
	}

	setCarrying(player, null);
}

function generalOrders(player: ServerPlayer, payload: GeneralOrdersMessagePayload) {
	const state = getState();
	if (player.role != PlayerRole.GENERAL) {
		return;
	} else if (player.team != payload.move.team) {
		// Make sure they don't try to be cheatin
		return;
	}

	const {briefing, move} = payload;
	state[player.team].briefings[briefing] = move;
}

function pong(playerId: ChesswarId) {
	socket.sendOne(playerId, {
		type: ServerMessageTypes.PONG,
		payload: null
	});
}
