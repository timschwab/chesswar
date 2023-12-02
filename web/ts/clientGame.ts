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

// Initialize loading of data
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Actually load the data
const positions = [
	0, 0,
	0, 0.5,
	0.5, 0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Render

// Set the viewport
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

gl.enableVertexAttribArray(positionAttributeLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
const size = 2;          // 2 components per iteration
const type = gl.FLOAT;   // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
const attribOffset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, attribOffset)

// Draw!
const primitiveType = gl.TRIANGLES;
const arraysOffset = 0;
const count = 3;
gl.drawArrays(primitiveType, arraysOffset, count);
