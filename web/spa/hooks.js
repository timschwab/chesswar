function createGroup() {
	let hooks = {};

	function register(name, func) {
		if (!hooks[name]) {
			hooks[name] = [];
		}

		hooks[name].push(func);
	}

	function run(name, val, otherwise) {
		if (hooks[name]) {
			for (let hook of hooks[name]) {
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

export default { createGroup };
