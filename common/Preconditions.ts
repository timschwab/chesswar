export function assertNever(value: never): void {
	console.error(value);
	throw "It should be impossible to get here";
}
