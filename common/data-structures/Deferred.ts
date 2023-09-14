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
		// Don't cause an update if there is no difference
		if (this.latestValue == next) {
			return;
		}

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

	trigger() {
		this.dirtyValue = true;
	}
}
