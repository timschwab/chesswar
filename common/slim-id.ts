// Globals
const encodings = "0123456789abcdefghijkmpqrstuwxyz";
const mask = 0b11111000;
const regex = new RegExp("[" + encodings + "]{16}");

// Pre-allocated values
const buffer = new Uint8Array(1000);
const vals = new Array(16);
let bufferPointer = 0;

// The main function
function make(): string {
	// Get the random bytes
	if (bufferPointer == 0) {
		crypto.getRandomValues(buffer);
	}

	// Convert from 10 8-bit strings to 16 5-bit strings
	for (let i = 0; i < 16; i++) {
		vals[i] = encodings[process(buffer, bufferPointer, i)];
	}

	bufferPointer = bufferPointer + 10;
	if (bufferPointer == 1000) {
		bufferPointer = 0;
	}

	// Convert to a string and return
	return vals.join("");
}

// Get the ith 5-bit sequence from the buffer bytes
function process(buf: Uint8Array, bufferPointer: number, i: number): number {
	const pos = 5 * i;
	const byte = 0 | (pos / 8);
	const rel = pos % 8;
	const off = rel - 3;

	const val1 = shift(buf[byte + bufferPointer] & (mask >> rel), off);

	const byte2 = byte + 1;
	const off2 = 8 - off;
	const val2 = (buf[byte2 + bufferPointer] & mask) >> off2;

	return val1 | val2;
}

// I wish this was doable in vanilla JS. Probably most CPUs don't support it though.
function shift(num: number, bits: number): number {
	if (bits > 0) {
		return num << bits;
	} else if (bits < 0) {
		return num >> -bits;
	} else {
		return num;
	}
}

// A nice function
function validate(str: string) {
	return regex.test(str);
}

export default {
	make,
	validate
};