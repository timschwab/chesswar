export type ChesswarId = string;

export enum BriefingName {
	ONE,
	TWO,
	THREE
}

export enum TeamName {
	ALPHA = "alpha",
	BRAVO = "bravo"
}

export enum PlayerRole {
	GENERAL = "general",
	SOLDIER = "soldier",
	TANK = "tank",
	OPERATIVE = "operative"
}

export enum CommandAction {
	BECOME_GENERAL = "become-general",
	BECOME_SOLDIER = "become-soldier",
	BECOME_TANK = "become-tank",
	BECOME_OPERATIVE = "become-operative",

	GRAB_ORDERS = "grab-orders",
	COMPLETE_ORDERS = "complete-orders",

	GATHER_INTEL = "gather-intel",
	REPORT_INTEL = "report-intel"
}

export type Victory = null | TeamName | "tie";
