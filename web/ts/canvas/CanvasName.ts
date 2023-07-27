enum CanvasNameSource {
	FIELD_BACKGROUND,
	FIELD,
	UI
}

// WHY DO ENUMS SUCK
// WHY IS THIS SO HARD

type CanvasWantedName = keyof typeof CanvasNameSource;
type CanvasRealKey = CanvasNameSource | CanvasWantedName;

const realObj = CanvasNameSource as Record<CanvasRealKey, CanvasRealKey>;
const realKeys = Object.values(realObj);

function isWantedName(maybeWantedKey: CanvasRealKey): maybeWantedKey is CanvasWantedName {
	return typeof maybeWantedKey == "string";
}

const wantedNames = realKeys.filter(key => isWantedName(key)) as CanvasWantedName[];

export type CanvasNameType = CanvasWantedName;
export const CanvasNameList = wantedNames;
