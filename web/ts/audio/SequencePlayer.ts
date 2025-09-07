import { SECONDS_PER_MEASURE, Sequence } from "./AudioTypes.ts";
import { NotePlayer } from "./NotePlayer.ts";

export class SequencePlayer {
	private readonly notePlayer: NotePlayer = new NotePlayer();

	play(sequence: Sequence) {
		for (const [index, chord] of sequence.chords.entries()) {
			for (const noteFrequency of chord) {
				const note = {
					frequency: noteFrequency,
					length: sequence.length
				};
				const delay = SECONDS_PER_MEASURE*sequence.length*index;

				this.notePlayer.play(note, delay);
			}
		}
	}
}
