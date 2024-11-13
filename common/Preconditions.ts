export function assertNever(value: never) {
	console.error(value);
	throw "It should be impossible to get here";
}
