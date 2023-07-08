import { Queue } from "../../common/data-structures/queue.ts";

interface Diff<T> {
	prev: T,
	cur: T
}

export function makeStore<T>(initialValue: T) {
	let previousValue: T;
	let currentValue: T = initialValue;
	const diffQueue: Queue<Diff<T>> = new Queue<Diff<T>>();

	const getPreviousValue = function(): T {
		return previousValue;
	}

	const getCurrentValue = function(): T {
		return currentValue;
	}

	const setValue = function(newValue: T): void {
		previousValue = currentValue;
		currentValue = newValue;

		const diff: Diff<T> = {
			prev: previousValue,
			cur: newValue
		};
		diffQueue.enqueue(diff);
	}

	const nextDiff = function(): Diff<T> | null {
		return diffQueue.dequeue();
	}

	return {
		getPreviousValue,
		getCurrentValue,
		setValue,
		nextDiff
	};
}