export type HookFunc<T> = (value: T) => void;

export class Hook<T> {
	private readonly hooks: HookFunc<T>[];

	constructor() {
		this.hooks = [];

		this.register = this.register.bind(this);
	}

	register(callback: HookFunc<T>): void {
		this.hooks.push(callback);
	}

	run(value: T): void {
		this.hooks.forEach(callback => callback(value));
	}
}

export class EventHook {
	private readonly delegate = new Hook<null>();

	register(callback: () => void): void {
		this.delegate.register(_nullValue => callback);
	}

	run(): void {
		this.delegate.run(null);
	}
}
