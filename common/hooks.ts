type HookFunc<T> = (value: T) => void;

export function createHook<T>() {
	const hooks: HookFunc<T>[] = [];

	const register = function(callback: HookFunc<T>): void {
		hooks.push(callback);
	};

	const run = function(value: T) {
		for (const hook of hooks) {
			hook(value);
		}
	}

	return {
		register,
		run
	};
}
