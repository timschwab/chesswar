import { Optional } from "../../../common/data-structures/Optional.ts";

const SUSPENDED = "suspended";

export class RefreshingAudioContext {
	private delegate: AudioContext | null = null;

	constructor() {
		this.initAudioContext();
	}

	private initAudioContext() {
		if (this.delegate === null) {
			this.delegate = new AudioContext();
			if (this.delegate.state == SUSPENDED) {
				this.delegate = null;
				setTimeout(this.initAudioContext.bind(this), 1000);
			}
		}
	}

	get(): Optional<AudioContext> {
		return Optional.ofNullable(this.delegate);
	}
}
