import { NoteFrequency } from "./NoteFrequency.ts";

const BEATS_PER_MINUTE = 144;
const BEATS_PER_SECOND = BEATS_PER_MINUTE/60;
export const SECONDS_PER_MEASURE = 4/BEATS_PER_SECOND;

export enum NoteLength {
	WHOLE = 1,
	HALF = 0.5,
	QUARTER = 0.25,
	EIGHTH = 0.125,
	SIXTEENTH = 0.0625
}

export interface Note {
	frequency: NoteFrequency,
	length: NoteLength
}

type Chord = NoteFrequency[];

export interface Sequence {
	chords: Chord[],
	length: NoteLength
}
