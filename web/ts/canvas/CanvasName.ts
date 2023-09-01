import { UnpackTuple } from "../../../common/typescript-utils.ts";

export const CanvasNameList = [
	"FIELD_BACKGROUND", "FIELD_GRID", "FIELD_MAP", "FIELD_PLAYERS", "FIELD", "UI"
] as const;

export type CanvasNameType = UnpackTuple<typeof CanvasNameList>;
