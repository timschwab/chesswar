export function assertNever(value: never): never {
	console.error(value);
	throw "It should be impossible to get here";
}

export function assertAllEqual(...listOfValues: number[]): void {
	if (listOfValues.length === 0) {
		return;
	}

	const firstValue = listOfValues[0];
	for (const value of listOfValues) {
		if (value !== firstValue) {
			throw `Value ${value} does not match first value ${firstValue}`;
		}
	}
}
