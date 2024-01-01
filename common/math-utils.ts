export function clampNumber(val: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, val));
}

export function count(amount: number): number[] {
	return Array.from(Array(amount).keys());
}
