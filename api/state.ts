import { Circle, Vector } from "../common/data-types/shapes.ts";
import { ChessPiece, ChesswarId, CommandAction, PlayerRole, TeamName } from "../common/data-types/types-base.ts";
import { MovementState } from "../common/data-types/types-server.ts";

export interface SquareState {
	piece: ChessPiece,
	team: TeamName
}

type Cell = SquareState | null;
type Row = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]; // tuple of 8
type Board = [Row, Row, Row, Row, Row, Row, Row, Row]; // tuple of 8

export interface ServerPlayerPhysics {
	mass: number,
	speed: Vector,
	position: Circle
}

export interface ServerPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	commandOption: CommandAction | null,
	movement: MovementState,
	physics: ServerPlayerPhysics
}

type PlayerMap = Map<ChesswarId, ServerPlayer>;

interface Team {
	teamBoard: Board
	playerMap: PlayerMap
}

interface ServerState {
	realBoard: Board,
	allPlayers: PlayerMap,
	[TeamName.ALPHA]: Team,
	[TeamName.BRAVO]: Team
}

const state: ServerState = {
	realBoard: newBoard(),
	allPlayers: new Map<ChesswarId, ServerPlayer>(),
	[TeamName.ALPHA]: {
		teamBoard: newBoard(),
		playerMap: new Map<ChesswarId, ServerPlayer>()
	},
	[TeamName.BRAVO]: {
		teamBoard: newBoard(),
		playerMap: new Map<ChesswarId, ServerPlayer>()
	}
};

function newBoard(): Board {
	const row1: Row = [
		{team: TeamName.ALPHA, piece: ChessPiece.ROOK},
		{team: TeamName.ALPHA, piece: ChessPiece.KNIGHT},
		{team: TeamName.ALPHA, piece: ChessPiece.BISHOP},
		{team: TeamName.ALPHA, piece: ChessPiece.QUEEN},
		{team: TeamName.ALPHA, piece: ChessPiece.KING},
		{team: TeamName.ALPHA, piece: ChessPiece.BISHOP},
		{team: TeamName.ALPHA, piece: ChessPiece.KNIGHT},
		{team: TeamName.ALPHA, piece: ChessPiece.ROOK}
	];

	const row2: Row = [
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN}
	];

	const row3: Row = [null, null, null, null, null, null, null, null];
	const row4: Row = [null, null, null, null, null, null, null, null];
	const row5: Row = [null, null, null, null, null, null, null, null];
	const row6: Row = [null, null, null, null, null, null, null, null];

	const row7: Row = [
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN}
	];

	const row8: Row = [
		{team: TeamName.BRAVO, piece: ChessPiece.ROOK},
		{team: TeamName.BRAVO, piece: ChessPiece.KNIGHT},
		{team: TeamName.BRAVO, piece: ChessPiece.BISHOP},
		{team: TeamName.BRAVO, piece: ChessPiece.QUEEN},
		{team: TeamName.BRAVO, piece: ChessPiece.KING},
		{team: TeamName.BRAVO, piece: ChessPiece.BISHOP},
		{team: TeamName.BRAVO, piece: ChessPiece.KNIGHT},
		{team: TeamName.BRAVO, piece: ChessPiece.ROOK}
	];

	return [row1, row2, row3, row4, row5, row6, row7, row8];
}

export default state;
