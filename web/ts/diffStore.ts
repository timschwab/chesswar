import { Queue } from "../../common/data-structures/queue.ts";

interface Diff<T> {
	prev: T,
	cur: T
}

export class DiffStore<T> {
	prevValue: T | null;
	curValue: T;
	diffQueue: Queue<Diff<T>>;

	constructor(initValue: T) {
		this.prevValue = null;
		this.curValue = initValue;
		this.diffQueue = new Queue<Diff<T>>();
	}

	value(): T {
		return this.curValue;
	}

	set(newValue: T): void {
		this.prevValue = this.curValue;
		this.curValue = newValue;

		const diff: Diff<T> = {
			prev: this.prevValue,
			cur: this.curValue
		};
		this.diffQueue.enqueue(diff);
	}

	nextDiff(): Diff<T> | null {
		return this.diffQueue.dequeue();
	}
}
