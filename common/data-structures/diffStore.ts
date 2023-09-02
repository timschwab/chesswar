import { Queue } from "./queue.ts";

export interface Diff<T extends NonNullable<unknown>> {
	prev: T | null,
	cur: T
}

export class DiffStore<T extends NonNullable<unknown>> {
	private curValue: T | null;
	private diffQueue: Queue<Diff<T>>;

	constructor() {
		this.curValue = null;
		this.diffQueue = new Queue<Diff<T>>();
	}

	value(): T | null {
		return this.curValue;
	}

	store(newValue: T): void {
		const prevValue = this.curValue;
		this.curValue = newValue;

		const diff: Diff<T> = {
			prev: prevValue,
			cur: this.curValue
		};
		this.diffQueue.enqueue(diff);
	}

	*diffs(): Generator<Diff<T>, void, void> {
		let val;
		while ((val = this.diffQueue.dequeue()) !== null) {
			yield val;
		}
	}

	lastSeen(): T | null {
		const last = this.diffQueue.peek();
		if (last == null || this.curValue == null) {
			return null;
		} else {
			return last.prev;
		}
	}

	markAsRead(): void {
		this.diffQueue.clear();
	}
}
