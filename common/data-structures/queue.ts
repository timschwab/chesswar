export class Queue<T> {
	values: Map<number,T>;
	head: number;
	tail: number;

	constructor() {
		this.values = new Map<number, T>();
		this.head = 0;
		this.tail = 0;
	}

	enqueue(value: T): void {
		this.values.set(this.tail, value);
		this.tail++;
	}

	dequeue(): T | null {
		const value = this.values.get(this.head);
		if (value === undefined) {
			return null;
		} else {
			this.values.delete(this.head);
			this.head++;
			return value;
		}
	}

	peek(): T | null {
		const value = this.values.get(this.head);
		if (value === undefined) {
			return null;
		} else {
			return value;
		}
	}

	clear(): void {
		this.values.clear();
		this.head = 0;
		this.tail = 0;
	}

	length(): number {
		return this.values.size;
	}
}