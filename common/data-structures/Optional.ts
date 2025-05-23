export class Optional<T> {
	private readonly value: T | null;

	constructor(value: T | null) {
		this.value = value;
	}

	get(): T {
		if (this.value === null) {
			throw "Trying to get an empty optional";
		} else {
			return this.value;
		}
	}

	isPresent(): boolean {
		return this.value !== null;
	}

	isEmpty(): boolean {
		return this.value === null;
	}
}