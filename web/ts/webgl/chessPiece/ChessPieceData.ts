import { ChessPiece } from "../../../../common/data-types/chess.ts";
import { Point } from "../../../../common/shapes/Point.ts";

export const chessPieceData = {
	[ChessPiece.KING]: [new Point(0.25, 0.25), new Point(0.25, 0.75), new Point(0.75, 0.25)],
	[ChessPiece.QUEEN]: [new Point(0.25, 0.25), new Point(0.25, 0.75), new Point(0.75, 0.25)],
	[ChessPiece.ROOK]: [new Point(0.25, 0.25), new Point(0.25, 0.75), new Point(0.75, 0.25)],
	[ChessPiece.BISHOP]: [new Point(0.25, 0.25), new Point(0.25, 0.75), new Point(0.75, 0.25)],
	[ChessPiece.KNIGHT]: [new Point(0.25, 0.25), new Point(0.25, 0.75), new Point(0.75, 0.25)],
	[ChessPiece.PAWN]: [new Point(0.25, 0.25), new Point(0.25, 0.75), new Point(0.75, 0.75)]
};
