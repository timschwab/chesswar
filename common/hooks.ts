type HookFunc<T> = (val: T) => void;
interface HookGroup {
	register: (name: string, func: HookFunc<unknown>) => void,
	run: (name: string, val: unknown, otherwise: () => void) => void
}

function createGroup(): HookGroup {
	const hooks = new Map<string, HookFunc<unknown>[]>();

	function register(name: string, func: HookFunc<unknown>): void {
		let funcArray = hooks.get(name);
		if (funcArray == null) {
			funcArray = [];
			hooks.set(name, funcArray);
		}

		funcArray.push(func);
	}

	function run(name: string, val: unknown, otherwise: () => void) {
		const hookList = hooks.get(name);
		if (hookList != null) {
			for (const hook of hookList) {
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
