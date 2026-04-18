import { ChesswarId, PlayerAction, PlayerRole, TeamName } from "../common/data-types/base.ts";
import { CarryLoad, CarryLoadType } from "../common/data-types/carryLoad.ts";
import { BriefingName } from "../common/data-types/facility.ts";
import { mapGeometry } from "../common/map/MapValues.ts";
import { ClientMessage, ClientMessageTypes, GeneralOrdersMessagePayload, MoveMessagePayload } from "../common/message-types/client.ts";
import { ServerMessageTypes } from "../common/message-types/server.ts";
import { gameEngine } from "../common/settings.ts";
import { Circle } from "../common/shapes/Circle.ts";
import { ZeroVector } from "../common/shapes/Zero.ts";
import { makeMove } from "./chess.ts";
import { SocketManager } from "./SocketManager.ts";
import { setCarrying } from "./spawn.ts";
import { getState, ServerPlayer } from "./state.ts";


export class MessageHandler {
	private readonly socket: SocketManager;

	constructor(socket: SocketManager) {
		this.socket = socket;
	}

	handleMessage(player: ServerPlayer, message: ClientMessage) {
		if (message.type == ClientMessageTypes.MOVE) {
			this.playerMove(player, message.payload);
		} else if (message.type == ClientMessageTypes.ACTION) {
			this.playerAction(player);
		} else if (message.type == ClientMessageTypes.GENERAL_ORDERS) {
			this.generalOrders(player, message.payload);
		} else if (message.type == ClientMessageTypes.PING) {
			this.pong(player.id);
		}
	}

	private playerMove(player: ServerPlayer, keys: MoveMessagePayload): void {
		player.movement = keys;
	}

	private playerAction(player: ServerPlayer): void {
		const state = getState();
		if (player.actionOption === null) {
			// Do nothing
		} else if (player.actionOption === PlayerAction.BECOME_GENERAL) {
			this.becomeRole(player, PlayerRole.GENERAL);
			this.socket.sendOne(player.id, {
				type: ServerMessageTypes.ACTION_COMPLETED,
				payload: PlayerAction.BECOME_GENERAL
			});
		} else if (player.actionOption === PlayerAction.BECOME_SOLDIER) {
			this.becomeRole(player, PlayerRole.SOLDIER);
			this.socket.sendOne(player.id, {
				type: ServerMessageTypes.ACTION_COMPLETED,
				payload: PlayerAction.BECOME_SOLDIER
			});
		} else if (player.actionOption === PlayerAction.BECOME_TANK) {
			this.becomeRole(player, PlayerRole.TANK);
			this.socket.sendOne(player.id, {
				type: ServerMessageTypes.ACTION_COMPLETED,
				payload: PlayerAction.BECOME_TANK
			});
		} else if (player.actionOption === PlayerAction.BECOME_OPERATIVE) {
			this.becomeRole(player, PlayerRole.OPERATIVE);
			this.socket.sendOne(player.id, {
				type: ServerMessageTypes.ACTION_COMPLETED,
				payload: PlayerAction.BECOME_OPERATIVE
			});
		} else if (player.actionOption === PlayerAction.GRAB_ORDERS) {
			this.becomeRole(player, PlayerRole.SOLDIER);
			const briefing = this.whichBriefing(player);
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
	
				setCarrying(this.socket, player, carryLoad);
				this.socket.sendOne(player.id, {
					type: ServerMessageTypes.ACTION_COMPLETED,
					payload: PlayerAction.GRAB_ORDERS
				});
			}
		} else if (player.actionOption === PlayerAction.COMPLETE_ORDERS) {
			if (player.carrying.type == CarryLoadType.ORDERS) {
				makeMove(state.realBoard, player.carrying.load);
				setCarrying(this.socket, player, null);
				this.socket.sendOne(player.id, {
					type: ServerMessageTypes.ACTION_COMPLETED,
					payload: PlayerAction.COMPLETE_ORDERS
				});
			}
		} else if (player.actionOption === PlayerAction.GATHER_INTEL) {
			const load: CarryLoad = {
				type: CarryLoadType.INTEL,
				load: structuredClone(state.realBoard)
			};
			setCarrying(this.socket, player, load);
			this.socket.sendOne(player.id, {
				type: ServerMessageTypes.ACTION_COMPLETED,
				payload: PlayerAction.GATHER_INTEL
			});
		} else if (player.actionOption === PlayerAction.REPORT_INTEL) {
			if (player.carrying.type == CarryLoadType.INTEL) {
				state[player.team].teamBoard = player.carrying.load;
				setCarrying(this.socket, player, null);
			}
			this.socket.sendOne(player.id, {
				type: ServerMessageTypes.ACTION_COMPLETED,
				payload: PlayerAction.REPORT_INTEL
			});
		} else if (player.actionOption === PlayerAction.CONDUCT_ESPIONAGE) {
			const oppositeTeam = player.team == TeamName.BLUE ? TeamName.RED : TeamName.BLUE;
			const load: CarryLoad = {
				type: CarryLoadType.ESPIONAGE,
				load: structuredClone(state[oppositeTeam].briefings)
			};
			setCarrying(this.socket, player, load);
			this.socket.sendOne(player.id, {
				type: ServerMessageTypes.ACTION_COMPLETED,
				payload: PlayerAction.CONDUCT_ESPIONAGE
			});
		} else if (player.actionOption === PlayerAction.REPORT_ESPIONAGE) {
			if (player.carrying.type == CarryLoadType.ESPIONAGE) {
				state[player.team].enemyBriefings = player.carrying.load;
				setCarrying(this.socket, player, null);
			}
			this.socket.sendOne(player.id, {
				type: ServerMessageTypes.ACTION_COMPLETED,
				payload: PlayerAction.REPORT_ESPIONAGE
			});
		}
	}
	
	private whichBriefing(player: ServerPlayer): null | BriefingName {
		const pos = player.physics.position;
		const teamBundle = mapGeometry.teamBundles[player.team];
	
		if (pos.inside(teamBundle.briefings[0])) {
			return BriefingName.ONE;
		} else if (pos.inside(teamBundle.briefings[1])) {
			return BriefingName.TWO;
		} else if (pos.inside(teamBundle.briefings[2])) {
			return BriefingName.THREE;
		}
	
		return null;
	}
	
	private becomeRole(player: ServerPlayer, role: PlayerRole): void {
		player.role = role;
		const radius = gameEngine.physics[role].radius;
		const mass = gameEngine.physics[role].mass;
	
		player.physics.mass = mass;
		player.physics.position = new Circle(player.physics.position.center, radius);
	
		if (role == PlayerRole.GENERAL) {
			player.physics.speed = ZeroVector;
		}
	
		setCarrying(this.socket, player, null);
	}

	private generalOrders(player: ServerPlayer, payload: GeneralOrdersMessagePayload) {
		const state = getState();
		if (player.role != PlayerRole.GENERAL) {
			return;
		} else if (player.team !== payload.move.team) {
			// Make sure they don't try to be cheatin
			return;
		}
	
		const {briefing, move} = payload;
		state[player.team].briefings[briefing] = move;
	}

	private pong(playerId: ChesswarId) {
		this.socket.sendOne(playerId, {
			type: ServerMessageTypes.PONG,
			payload: null
		});
	}
}
