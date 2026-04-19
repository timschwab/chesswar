import { Note, SECONDS_PER_MEASURE } from "./AudioTypes.ts";
import { RefreshingAudioContext } from "./RefreshingAudioContext.ts";

const ATTACK_TIME = 0.01;
const PEAK_AMP = 0.5;
const DECAY_TIME = 0.1;
const SUSTAIN_AMP = 0.2;
const RELEASE_TIME = 0.5;

export class NotePlayer {
	private readonly audioContext: RefreshingAudioContext = new RefreshingAudioContext();

	// Is a noop if the audio context is not available
	play(note: Note, delay: number): void {
		// Get the audio context if it is available, otherwise immediately return
		const maybeAc = this.audioContext.get();
		if (maybeAc.isEmpty()) {
			return;
		}
		const ac = maybeAc.get();

		// Set the timings
		const now = ac.currentTime;
		const start = now + delay;
		const peak = start + ATTACK_TIME;
		const sustainStart = peak + DECAY_TIME;
		const sustainEnd = Math.max(start + note.length*SECONDS_PER_MEASURE, sustainStart);
		const finish = sustainEnd + RELEASE_TIME;
	
		// Create the oscillator and gain node and connect them together
		const oscNode = ac.createOscillator();
		const gainNode = ac.createGain();
	
		oscNode.connect(gainNode);
		gainNode.connect(ac.destination);
	
		oscNode.type = "triangle";
		oscNode.frequency.value = note.frequency;
	
		// Adjust gain according to the timings
		oscNode.start(start);
		gainNode.gain.setValueAtTime(0, start);
		gainNode.gain.linearRampToValueAtTime(PEAK_AMP, peak);
		gainNode.gain.linearRampToValueAtTime(SUSTAIN_AMP, sustainStart);
		gainNode.gain.setValueAtTime(SUSTAIN_AMP, sustainEnd);
		gainNode.gain.linearRampToValueAtTime(0, finish);
		oscNode.stop(finish);
	}
}
