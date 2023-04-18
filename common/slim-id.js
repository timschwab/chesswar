// Globals
const encodings = "0123456789abcdefghijkmpqrstuwxyz";
const mask = 0b11111000;
const regex = new RegExp("[" + encodings + "]{16}");

// Pre-allocated values
let buffer = new Uint8Array(1000);
let bufferPointer = 0;
let vals = new Array(16);

// The main function
async function make() {
	// Get the random bytes
	if (bufferPointer == 0) {
		await crypto.getRandomValues(buffer);
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
function process(buf, bufferPointer, i) {
	let pos = 5 * i;
	let byte = 0 | (pos / 8);
	let rel = pos % 8;
	let off = rel - 3;

	let val1 = shift(buf[byte + bufferPointer] & (mask >> rel), off);

	let byte2 = byte + 1;
	let off2 = 8 - off;
	let val2 = (buf[byte2 + bufferPointer] & mask) >> off2;

	return val1 | val2;
}

// I wish this was doable in vanilla JS. Probably most CPUs don't support it though.
function shift(num, bits) {
	if (bits > 0) {
		return num << bits;
	} else if (bits < 0) {
		return num >> -bits;
	} else {
		return num;
	}
}

// A nice function
function validate(str) {
	return regex.test(str);
}

export default {
	make,
	validate
};