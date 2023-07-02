import { NoteFreq } from "./noteFrequencies.ts";

enum NoteLen {
	WHOLE = 1,
	HALF = 0.5,
	QUARTER = 0.25,
	EIGHTH = 0.125,
	SIXTEENTH = 0.0625,
}

interface Note {
	freq: NoteFreq,
	len: NoteLen
}

const bpm = 144;
const bps = bpm/60;
const spm = 4/bps; // Seconds per measure (whole note)

const attackTime = 0.01;
const peakAmp = 0.5;
const decayTime = 0.1;
const sustainAmp = 0.2;
const releaseTime = 0.5;

let ac: AudioContext;

declare global {
	// deno-lint-ignore no-var
	var audio: unknown;
}

globalThis.audio = {
	initAudio,
	NoteFreq,
	NoteLen,
	spm,
	note,
	playSequence,

	grabOrders,
	completeOrders,
};

export function initAudio(): void {
	ac = new AudioContext();

	if (ac.state == "suspended") {
		setTimeout(initAudio, 1000);
	}
}

function note(n: Note, delay: number): void {
	const now = ac.currentTime;

	const start = now + delay;
	const peak = start + attackTime;
	const sustainStart = peak + decayTime;
	const sustainEnd = Math.max(start + n.len*spm, sustainStart);
	const finish = sustainEnd + releaseTime;

	const oscNode = ac.createOscillator();
	const gainNode = ac.createGain();

	oscNode.connect(gainNode);
	gainNode.connect(ac.destination);

	oscNode.type = "triangle";
	oscNode.frequency.value = n.freq;

	oscNode.start(start);
	gainNode.gain.setValueAtTime(0, start);
	gainNode.gain.linearRampToValueAtTime(peakAmp, peak);
	gainNode.gain.linearRampToValueAtTime(sustainAmp, sustainStart);
	gainNode.gain.setValueAtTime(sustainAmp, sustainEnd);
	gainNode.gain.linearRampToValueAtTime(0, finish);
	oscNode.stop(finish);
}

function playSequence(seq: NoteFreq[][], len: NoteLen) {
	for (const [index, group] of seq.entries()) {
		for (const n of group) {
			note({
				freq: n,
				len: len
			}, index*spm*len);
		}
	}
}

function grabOrders() {
	playSequence([
		[NoteFreq.A3, NoteFreq.E3],
		[NoteFreq.A3, NoteFreq.E3, NoteFreq.A4],
		[NoteFreq.A3,              NoteFreq.A4]
	], NoteLen.SIXTEENTH);
}

function completeOrders() {
	playSequence([
		[NoteFreq.A3, NoteFreq.A4],
		[NoteFreq.A3, NoteFreq.E3]
	], NoteLen.SIXTEENTH);
}

function tankDeath() {
	playSequence([
		[NoteFreq.A4, NoteFreq.CSHARP4],
		[NoteFreq.GSHARP4, NoteFreq.C4],
		[NoteFreq.G4, NoteFreq.B3]
	], NoteLen.QUARTER);
}

function death2() {
	playSequence([
		[NoteFreq.D3, NoteFreq.F3],
		[NoteFreq.CSHARP3, NoteFreq.E3]
	], NoteLen.EIGHTH);
}

function trapDeath() {
	playSequence([
		[NoteFreq.B1, NoteFreq.B2, NoteFreq.F3],
	], NoteLen.QUARTER);
}

export default {
	grabOrders,
	completeOrders,
	tankDeath,
	trapDeath
};
