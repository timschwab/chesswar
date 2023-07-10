import { Queue } from "../../common/data-structures/queue.ts";

interface Diff<T> {
	prev: T,
	cur: T
}

export class DiffStore<T> {
	private prevValue: T | null;
	private curValue: T;
	private diffQueue: Queue<Diff<T>>;

	constructor(initValue: T) {
		this.prevValue = null;
		this.curValue = initValue;
		this.diffQueue = new Queue<Diff<T>>();
	}

	value(): T {
		return this.curValue;
	}

	store(newValue: T): void {
		this.prevValue = this.curValue;
		this.curValue = newValue;

		const diff: Diff<T> = {
			prev: this.prevValue,
			cur: this.curValue
		};
		this.diffQueue.enqueue(diff);
	}

	*diffs(): Generator<Diff<T>, void, Diff<T>> {
		let val;
		while ((val = this.diffQueue.dequeue()) !== null) {
			yield val;
		}
	}
}
