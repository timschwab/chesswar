function createHook<T>() {
	type HookFunc = (value: T) => void;

	const hooks = new Array<HookFunc>();

	const register = function(callback: HookFunc): void {
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

export default {
	create: createHook
};
