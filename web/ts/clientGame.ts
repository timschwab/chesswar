import { createHtmlCanvas } from "./dom.ts";
import fragmentShaderSource from "./fragmentShader.ts";
import vertexShaderSource from "./vertexShader.ts";
import { createProgram, createShader } from "./webglUtils.ts";

// Get the basic context
const canvas = createHtmlCanvas();
canvas.width = 500;
canvas.height = 500;
const gl = canvas.getContext("webgl");
if (gl == null) {
	throw "Can't use WebGL apparently";
}

// Build the 2 shaders and link them into a program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

// Grab locations
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
const colorUniformLocation = gl.getUniformLocation(program, "u_color");

// Create buffers
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// End of initialization code, beginning of render code

// Set the viewport
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// set the resolution
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// Prep the position attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
const size = 2;          // 2 components per iteration
const type = gl.FLOAT;   // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
const attribOffset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, attribOffset)

// draw 50 random rectangles in random colors
for (let ii = 0; ii < 50; ++ii) {
	// Setup a random rectangle
	// This will write to positionBuffer because
	// its the last thing we bound on the ARRAY_BUFFER
	// bind point
	setRectangle(
		gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

	// Set a random color.
	gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

	// Draw the rectangle.
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Functions

// Returns a random integer from 0 to range - 1.
function randomInt(range: number) {
	return Math.floor(Math.random() * range);
}

// Fills the buffer with the values that define a rectangle.
function setRectangle(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
	const x1 = x;
	const x2 = x + width;
	const y1 = y;
	const y2 = y + height;

	// NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
	// whatever buffer is bound to the `ARRAY_BUFFER` bind point
	// but so far we only have one buffer. If we had more than one
	// buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

	const positions = [
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
}
