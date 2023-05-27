// This is kinda jank but works
export function deepCopy<T>(original: T): T {
	// Handle the simple types
	if (typeof original != "object") {
		return original;
	}

	// Handle array
	if (original instanceof Array) {
		return original.map(element => deepCopy(element)) as T;
	}

	// Handle object
	const copy = {} as Record<string, unknown>;
	for (const [key, value] of Object.entries(original as Record<string, unknown>)) {
		copy[key] = deepCopy(value);
	}
	return copy as T;
}
