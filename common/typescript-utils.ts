/*
	Not sure why TypeScript doesn't do these by default
*/

export function objectKeys<K extends PropertyKey>(obj: Record<K, unknown>): K[] {
	const result = Object.keys(obj) as K[];
	return result;
}

export function tuple<F, S>(first: F, second: S): [F, S] {
	return [first, second];
}

export function objectFromEntries<K extends PropertyKey, V>(entries: [K, V][]): Record<K, V> {
	const result = Object.fromEntries(entries) as Record<K, V>;
	return result;
}

export function objectMap<K extends PropertyKey, V>(obj: Record<K, unknown>, mapper: (key: K, index: number) => V): Record<K, V> {
	const keys = objectKeys(obj);
	const entries = keys.map((key, index) =>  tuple(key, mapper(key, index)));
	const result = objectFromEntries(entries);

	return result;
}
