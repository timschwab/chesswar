export class Optional<T> {
	private readonly delegate: OptionalDelegate<T>;

	private constructor(delegate: OptionalDelegate<T>) {
		this.delegate = delegate;
	}

	// Static constructors
	static of<T>(value: T): Optional<T> {
		const delegate = new PresentOptional(value);
		return new Optional<T>(delegate);
	}

	static empty<T>(): Optional<T> {
		return new Optional<T>(EMPTY_OPTIONAL);
	}

	static ofNullable<T>(value: T | null): Optional<T> {
		if (value === null) {
			return Optional.empty();
		} else {
			return Optional.of(value);
		}
	}

	// Core functions
	get(): T {
		return this.delegate.get();
	}

	isPresent(): boolean {
		return this.delegate.isPresent();
	}

	isEmpty(): boolean {
		return this.delegate.isEmpty();
	}

	// Utility functions
	map<NewType>(mapper: (value: T) => NewType): Optional<NewType> {
		if (this.delegate.isPresent()) {
			return Optional.of(mapper(this.delegate.get()));
		} else {
			return Optional.empty();
		}
	}

	ifPresent(callback: (value: T) => void): void {
		if (this.delegate.isPresent()) {
			callback(this.delegate.get());
		}
	}
}

interface OptionalDelegate<T> {
	get: () => T,
	isPresent: () => boolean,
	isEmpty: () => boolean
}

class PresentOptional<T> implements OptionalDelegate<T> {
	private readonly value: T;

	constructor(value: T) {
		this.value = value;
	}

	get() {
		return this.value;
	}
	
	isPresent() {
		return true;
	}

	isEmpty() {
		return false;
	}
}

const EMPTY_OPTIONAL: OptionalDelegate<never> = {
	get: () => { throw "Trying to get value on empty optional"; },
	isPresent: () => false,
	isEmpty: () => true
};
