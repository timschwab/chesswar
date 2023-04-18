function createGroup() {
	const hooks = {};

	function register(name, func) {
		if (!hooks[name]) {
			hooks[name] = [];
		}

		hooks[name].push(func);
	}

	function run(name, val, otherwise) {
		if (hooks[name]) {
			for (const hook of hooks[name]) {
				hook(val);
			}
		} else if (otherwise) {
			// If nothing has been registered to this hook
			otherwise();
		} else {
			// Do nothing
		}
	}

	return {
		register,
		run
	};
}

export default {
	createGroup
};
