import { NoteLength } from "./AudioTypes.ts";
import { NoteFrequency } from "./NoteFrequency.ts";
import { SequencePlayer } from "./SequencePlayer.ts";

// All the sequences we can play
const GRAB_ORDERS = {
	chords: [
		[NoteFrequency.A3, NoteFrequency.E3],
		[NoteFrequency.A3, NoteFrequency.E3, NoteFrequency.A4],
		[NoteFrequency.A3,                   NoteFrequency.A4]
	],
	length: NoteLength.SIXTEENTH
};

const COMPLETE_ORDERS = {
	chords: [
		[NoteFrequency.A3, NoteFrequency.A4],
		[NoteFrequency.A3, NoteFrequency.E3]
	],
	length: NoteLength.SIXTEENTH
};

const DEATH_1 = {
	chords: [
		[NoteFrequency.A4, NoteFrequency.CSHARP4],
		[NoteFrequency.GSHARP4, NoteFrequency.C4],
		[NoteFrequency.G4, NoteFrequency.B3]
	],
	length: NoteLength.QUARTER
};

const DEATH_2 = {
	chords: [
		[NoteFrequency.D3, NoteFrequency.F3],
		[NoteFrequency.CSHARP3, NoteFrequency.E3]
	],
	length: NoteLength.EIGHTH
};

const DEATH_3 = {
	chords: [
		[NoteFrequency.B1, NoteFrequency.B2, NoteFrequency.F3],
	],
	length: NoteLength.QUARTER
};

// The class that plays them
export class ChesswarAudioPlayer {
	private readonly sequencePlayer: SequencePlayer = new SequencePlayer();

	grabOrders(): void {
		this.sequencePlayer.play(GRAB_ORDERS);
	}

	completeOrders(): void {
		this.sequencePlayer.play(COMPLETE_ORDERS);
	}

	death1(): void {
		this.sequencePlayer.play(DEATH_1);
	}

	death2(): void {
		this.sequencePlayer.play(DEATH_2);
	}

	death3(): void {
		this.sequencePlayer.play(DEATH_3);
	}
}
