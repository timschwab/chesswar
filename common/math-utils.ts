export function clampNumber(val: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, val));
}

export function *count(amount: number) {
	for (let i = 0 ; i < amount ; i++) {
		yield i;
	}
}
