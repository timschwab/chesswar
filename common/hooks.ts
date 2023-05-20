export function createHook<T>() {
	const hooks = new Array<(value: T) => void>();

	const register = function(callback: (value: T) => void): void {
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
