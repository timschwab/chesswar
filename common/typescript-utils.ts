export type UnpackTuple<T> = T extends readonly (infer Element)[] ? Element : never;

export function objectKeys<K extends PropertyKey>(obj: Record<K, unknown>): K[] {
	const result = Object.keys(obj) as K[];
	return result;
}

export function objectEntries<K extends PropertyKey, V>(obj: Record<K, V>): [K, V][] {
	const result = Object.entries(obj) as [K, V][];
	return result;
}

export function objectFromEntries<K extends PropertyKey, V>(entries: (readonly [K, V])[]): Record<K, V> {
	const result = Object.fromEntries(entries) as Record<K, V>;
	return result;
}

export function objectMap<K extends PropertyKey, V1, V2>(obj: Record<K, V1>, mapper: (key: K, value: V1, index: number) => V2): Record<K, V2> {
	const entries = objectEntries(obj);
	const mapped = entries.map(([key, value], index) => [key, mapper(key, value, index)] as const);
	const result = objectFromEntries(mapped);

	return result;
}
