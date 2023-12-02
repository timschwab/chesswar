import { createHtmlCanvas } from "./dom.ts";
import fragmentShaderSource from "./fragmentShader.ts";
import vertexShaderSource from "./vertexShader.ts";
import { createProgram, createShader } from "./webglUtils.ts";

// Get the basic context
const width = globalThis.innerWidth;
const height = globalThis.innerHeight;

const canvas = createHtmlCanvas();
canvas.width = width;
canvas.height = height;
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
gl.viewport(0, 0, width, height);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// set the resolution
gl.uniform2f(resolutionUniformLocation, width, height);

// End of real initialization code, real beginning of render code

requestAnimationFrame(() => drawTriangles(gl));

// Functions

function drawTriangles(gl: WebGLRenderingContext) {
	requestAnimationFrame(() => drawTriangles(gl));

	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Prep the position attribute
	gl.enableVertexAttribArray(positionAttributeLocation);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	const size = 2;          // 2 components per iteration
	const type = gl.FLOAT;   // the data is 32bit floats
	const normalize = false; // don't normalize the data
	const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	const attribOffset = 0;  // start at the beginning of the buffer
	gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, attribOffset)

	// draw random triangles in random colors
	for (let ii = 0; ii < 10; ++ii) {
		const positions = [
			randomInt(width), randomInt(height),
			randomInt(width), randomInt(height),
			randomInt(width), randomInt(height),
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		// Set a random color.
		gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

		// Draw the triangle
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
}

// Returns a random integer in [0, range)
function randomInt(range: number) {
	return Math.floor(Math.random() * range);
}
