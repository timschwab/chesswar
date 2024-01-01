import { createHtmlCanvas } from "./dom.ts";
import fragmentShaderSource from "./generated/fragmentShader.ts";
import vertexShaderSource from "./generated/vertexShader.ts";
import { assignData, createProgram, createShader, getGl, makeBuffer, setData } from "./webglUtils.ts";

// Get the basic context
const width = globalThis.innerWidth;
const height = globalThis.innerHeight;

const canvas = createHtmlCanvas();
canvas.width = width;
canvas.height = height;
const gl = getGl(canvas);

// Build the 2 shaders and link them into a program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

// Grab locations
const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

// Create buffers
const positionBufferId = makeBuffer(gl);
const colorBufferId = makeBuffer(gl);

// Set the viewport
gl.viewport(0, 0, width, height);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// set the resolution
gl.uniform2f(resolutionUniformLocation, width, height);

requestAnimationFrame(render);

// Functions

function render() {
	requestAnimationFrame(render);
	const triangleData = Array(5).fill(null).map(() => randomTriangle());
	drawTriangles(gl, triangleData);
}

function drawTriangles(gl: WebGLRenderingContext, triangleData: CWTriangle[]) {
	const trianglePositions = triangleData.map(tri => tri.coords).flat(2);
	const triangleColors = triangleData.map(tri => Array(3).fill(tri.color)).flat(2);

	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Load the data
	setData(gl, positionBufferId, trianglePositions);
	setData(gl, colorBufferId, triangleColors);

	// Set the attributes
	assignData(gl, positionBufferId, positionAttributeLocation, 2);
	assignData(gl, colorBufferId, colorAttributeLocation, 3);

	// Draw the triangles
	gl.drawArrays(gl.TRIANGLES, 0, triangleData.length*3);
}

interface CWTriangle {
	coords: [[number, number], [number, number], [number, number]],
	color: [number, number, number]
};

function randomTriangle(): CWTriangle {
	return {
		coords: [
			[randomInt(width), randomInt(height)],
			[randomInt(width), randomInt(height)],
			[randomInt(width), randomInt(height)]
		],
		color: [Math.random(), Math.random(), Math.random()]
	};
}

// Returns a random integer in [0, range)
function randomInt(range: number) {
	return Math.floor(Math.random() * range);
}
