import { ChessPiece } from "../../../../common/data-types/chess.ts";
import { Point } from "../../../../common/shapes/Point.ts";

type TriArr = [
	number, number,
	number, number,
	number, number
][];

const kingData: TriArr = [
	[0.40, 0.85, 0.60, 0.85, 0.50, 0.15],
	[0.40, 0.25, 0.40, 0.35, 0.55, 0.30],
	[0.60, 0.25, 0.60, 0.35, 0.45, 0.30]
];

const queenData: TriArr = [
	[0.30, 0.80, 0.70, 0.80, 0.50, 0.15],
	[0.30, 0.20, 0.50, 0.35, 0.50, 0.75],
	[0.70, 0.20, 0.50, 0.35, 0.50, 0.75]
];

const rookData: TriArr = [
	[0.25, 0.25, 0.25, 0.75, 0.75, 0.75],
	[0.75, 0.25, 0.75, 0.75, 0.25, 0.75],
	[0.25, 0.50, 0.50, 0.25, 0.75, 0.50]
];

const bishopData: TriArr = [
	[0.40, 0.80, 0.60, 0.80, 0.50, 0.30],
	[0.40, 0.30, 0.60, 0.30, 0.50, 0.80],
	[0.40, 0.30, 0.60, 0.30, 0.50, 0.20],
];

const knightData: TriArr = [
	[0.75, 0.75, 0.25, 0.75, 0.25, 0.50],
	[0.25, 0.75, 0.25, 0.25, 0.50, 0.25],
	[0.25, 0.25, 0.75, 0.25, 0.75, 0.50]
];

const pawnData: TriArr = [
	[0.25, 0.75, 0.75, 0.75, 0.25, 0.60],
	[0.75, 0.75, 0.25, 0.75, 0.75, 0.60],
	[0.40, 0.75, 0.60, 0.75, 0.50, 0.40],
];


function convertTriArr(arr: TriArr): Point[] {
	return arr.flatMap(row => [
		new Point(row[0], row[1]),
		new Point(row[2], row[3]),
		new Point(row[4], row[5])
	]);
}

export const chessPieceData = {
	[ChessPiece.KING]: convertTriArr(kingData),
	[ChessPiece.QUEEN]: convertTriArr(queenData),
	[ChessPiece.ROOK]: convertTriArr(rookData),
	[ChessPiece.BISHOP]: convertTriArr(bishopData),
	[ChessPiece.KNIGHT]: convertTriArr(knightData),
	[ChessPiece.PAWN]: convertTriArr(pawnData)
};
