import { Comparable } from "../Comparable.ts";

export class Deferred<T> {
	private latestValue: T;
	private previousValue: T;
	private dirtyValue: boolean;

	constructor(initial: T) {
		this.latestValue = initial;
		this.previousValue = initial;
		this.dirtyValue = false;
	}

	set(next: T): void {
		this.latestValue = next;
		this.dirtyValue = true;
	}

	get() {
		const returnValue = {
			dirty: this.dirtyValue,
			latest: this.latestValue,
			previous: this.previousValue
		};

		this.previousValue = this.latestValue;
		this.dirtyValue = false;

		return returnValue;
	}

	peek() {
		return {
			dirty: this.dirtyValue,
			latest: this.latestValue,
			previous: this.previousValue
		}
	}

	trigger() {
		this.dirtyValue = true;
	}
}

export class SimpleDeferred<T extends string | number | boolean | null> extends Deferred<T> {
	constructor(initial: T) {
		super(initial);
	}

	set(next: T): void {
		if (this.peek().latest == next) {
			// Do nothing
		} else {
			super.set(next);
		}
	}
}

export class ComparableDeferred<T extends Comparable<T>> extends Deferred<T> {
	constructor(initial: T) {
		super(initial);
	}

	set(next: T): void {
	  if (this.peek().latest.equals(next)) {
		// Do nothing
	  } else {
		super.set(next);
	  }
	}
}
