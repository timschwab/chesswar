export type ChesswarId = string;

export enum TeamName {
	BLUE = "blue",
	RED = "red"
}

export enum PlayerRole {
	GENERAL = "general",
	SOLDIER = "soldier",
	TANK = "tank",
	OPERATIVE = "operative"
}

export enum PlayerAction {
	BECOME_GENERAL = "become-general",
	BECOME_SOLDIER = "become-soldier",
	BECOME_TANK = "become-tank",
	BECOME_OPERATIVE = "become-operative",

	GRAB_ORDERS = "grab-orders",
	COMPLETE_ORDERS = "complete-orders",

	GATHER_INTEL = "gather-intel",
	REPORT_INTEL = "report-intel",

	CONDUCT_ESPIONAGE = "conduct-espionage",
	REPORT_ESPIONAGE = "report-espionage"
}

export type Victory = null | TeamName | "tie";

export type MovementState = {
	left: boolean,
	right: boolean,
	up: boolean,
	down: boolean
}

export enum DeathCause {
	TRAP = "trap",
	TANK = "tank"
}
