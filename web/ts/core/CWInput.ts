import { Hook, HookFunc } from "../../../common/data-structures/Hook.ts";
import { Point } from "../../../common/shapes/Point.ts";

export enum CWKey {
	UP = "up",
	DOWN = "down",
	LEFT = "left",
	RIGHT = "right",
	ACTION = "action",
	STATS = "stats"
}

export interface CWKeyEvent {
	key: CWKey,
	pressed: boolean
}

const KeyCodeTranslation = {
	ArrowLeft: CWKey.LEFT,
	ArrowRight: CWKey.RIGHT,
	ArrowUp: CWKey.UP,
	ArrowDown: CWKey.DOWN,

	KeyW: CWKey.UP,
	KeyA: CWKey.LEFT,
	KeyS: CWKey.DOWN,
	KeyD: CWKey.RIGHT,

	Enter: CWKey.ACTION,
	Space: CWKey.ACTION,
	Period: CWKey.STATS
}

export class CWInput {
	private readonly keyHook = new Hook<CWKeyEvent>();
	private readonly clickHook = new Hook<Point>();

	listenKey(callback: HookFunc<CWKeyEvent>) {
		this.keyHook.register(callback);
	}

	listenClick(callback: HookFunc<Point>) {
		this.clickHook.register(callback);
	}

	start() {
		document.addEventListener("keydown", this.handleKeyDown.bind(this));
		document.addEventListener("keyup", this.handleKeyUp.bind(this));
		document.addEventListener("click", this.handleClick.bind(this));
	}

	private handleKeyDown(event: KeyboardEvent) {
		if (event.repeat) {
			// Do nothing
			return;
		}

		this.handleKey(event, true);
	}

	private handleKeyUp(event: KeyboardEvent) {
		this.handleKey(event, false);
	}

	private handleKey(event: KeyboardEvent, pressed: boolean) {
		const code = event.code;

		if (this.isTranslatable(code)) {
			const key = KeyCodeTranslation[code];
			this.keyHook.run({
				key,
				pressed
			});
		} else {
			console.log("Unused key code", code);
		}
	}

	private isTranslatable(code: string): code is keyof typeof KeyCodeTranslation {
		if (code in KeyCodeTranslation) {
			return true;
		} else {
			return false;
		}
	}

	private handleClick(event: MouseEvent) {
		const location = new Point(event.clientX, event.clientY);
		this.clickHook.run(location);
	}
}
