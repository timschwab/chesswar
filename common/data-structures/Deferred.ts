export class Deferred<T> {
	private currentValue: T;
	private pendingValue: T | null;
	private dirtyValue: boolean;

	constructor(initial: T) {
		this.currentValue = initial;
		this.pendingValue = null;
		this.dirtyValue = false;
	}

	set(next: T): void {
		this.pendingValue = next;
		this.dirtyValue = true;
	}

	get() {
		const returnValue = {
			current: this.currentValue,
			pending: this.pendingValue
		};

		if (this.dirtyValue) {
			this.currentValue = (this.pendingValue as T);
			this.pendingValue = null;
			this.dirtyValue = false;
		}

		return returnValue;
	}
}
