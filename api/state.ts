import { ChesswarId, MovementState, PlayerAction, PlayerRole, TeamName, Victory } from "../common/data-types/base.ts";
import { CarryLoad } from "../common/data-types/carryLoad.ts";
import { ChessBoard, ChessPiece, ChessRow } from "../common/data-types/chess.ts";
import { BriefingBundle, BriefingName } from "../common/data-types/facility.ts";
import { ServerStats } from "../common/data-types/server.ts";
import { Circle, Vector } from "../common/shapes/types.ts";

export interface ServerPlayerPhysics {
	mass: number,
	speed: Vector,
	position: Circle
}

export interface ServerPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	actionOption: PlayerAction | null,
	carrying: CarryLoad,
	movement: MovementState,
	physics: ServerPlayerPhysics,
	deathCounter: number
}

type PlayerMap = Map<ChesswarId, ServerPlayer>;

interface Team {
	playerMap: PlayerMap,
	teamBoard: ChessBoard,
	briefings: BriefingBundle,
	enemyBriefings: BriefingBundle
}

interface ServerState {
	count: number,
	victory: Victory,
	realBoard: ChessBoard,
	allPlayers: PlayerMap,
	[TeamName.BLUE]: Team,
	[TeamName.RED]: Team,
	stats: ServerStats,
	newGameCounter: number
}

const state: ServerState = {
	count: 0,
	victory: null,
	realBoard: newBoard(),
	allPlayers: new Map<ChesswarId, ServerPlayer>(),
	[TeamName.BLUE]: {
		playerMap: new Map<ChesswarId, ServerPlayer>(),
		teamBoard: newBoard(),
		briefings: {
			[BriefingName.ONE]: null,
			[BriefingName.TWO]: null,
			[BriefingName.THREE]: null
		},
		enemyBriefings: {
			[BriefingName.ONE]: null,
			[BriefingName.TWO]: null,
			[BriefingName.THREE]: null
		}
	},
	[TeamName.RED]: {
		playerMap: new Map<ChesswarId, ServerPlayer>(),
		teamBoard: newBoard(),
		briefings: {
			[BriefingName.ONE]: null,
			[BriefingName.TWO]: null,
			[BriefingName.THREE]: null
		},
		enemyBriefings: {
			[BriefingName.ONE]: null,
			[BriefingName.TWO]: null,
			[BriefingName.THREE]: null
		}
	},
	stats: {
		tickMs: 0
	},
	newGameCounter: Infinity
};

function newBoard(): ChessBoard {
	const row1: ChessRow = [
		{team: TeamName.BLUE, piece: ChessPiece.ROOK},
		{team: TeamName.BLUE, piece: ChessPiece.KNIGHT},
		{team: TeamName.BLUE, piece: ChessPiece.BISHOP},
		{team: TeamName.BLUE, piece: ChessPiece.QUEEN},
		{team: TeamName.BLUE, piece: ChessPiece.KING},
		{team: TeamName.BLUE, piece: ChessPiece.BISHOP},
		{team: TeamName.BLUE, piece: ChessPiece.KNIGHT},
		{team: TeamName.BLUE, piece: ChessPiece.ROOK}
	];

	const row2: ChessRow = [
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN},
		{team: TeamName.BLUE, piece: ChessPiece.PAWN}
	];

	const row3: ChessRow = [null, null, null, null, null, null, null, null];
	const row4: ChessRow = [null, null, null, null, null, null, null, null];
	const row5: ChessRow = [null, null, null, null, null, null, null, null];
	const row6: ChessRow = [null, null, null, null, null, null, null, null];

	const row7: ChessRow = [
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN},
		{team: TeamName.RED, piece: ChessPiece.PAWN}
	];

	const row8: ChessRow = [
		{team: TeamName.RED, piece: ChessPiece.ROOK},
		{team: TeamName.RED, piece: ChessPiece.KNIGHT},
		{team: TeamName.RED, piece: ChessPiece.BISHOP},
		{team: TeamName.RED, piece: ChessPiece.QUEEN},
		{team: TeamName.RED, piece: ChessPiece.KING},
		{team: TeamName.RED, piece: ChessPiece.BISHOP},
		{team: TeamName.RED, piece: ChessPiece.KNIGHT},
		{team: TeamName.RED, piece: ChessPiece.ROOK}
	];

	return [row1, row2, row3, row4, row5, row6, row7, row8];
}

export default state;
