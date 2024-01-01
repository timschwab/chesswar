import fragmentShaderSource from "./generated/fragmentShader.ts";
import vertexShaderSource from "./generated/vertexShader.ts";
import { assignData, createProgram, createShader, getGl, makeBuffer, setData } from "./webglUtils.ts";

let canvas: HTMLCanvasElement;
let gl: WebGLRenderingContext;

let screenUniformLocation: WebGLUniformLocation | null;
let cameraUniformLocation: WebGLUniformLocation | null;
let positionAttributeLocation: number;
let colorAttributeLocation: number;
let positionBufferId: WebGLBuffer;
let colorBufferId: WebGLBuffer;

export interface CWTriangle {
	coords: [[number, number], [number, number], [number, number]],
	color: [number, number, number]
};

export function webglInit(canvasIn: HTMLCanvasElement) {
	canvas = canvasIn;
	gl = getGl(canvas);

	// Build the 2 shaders and link them into a program
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	const program = createProgram(gl, vertexShader, fragmentShader);
	gl.useProgram(program);

	// Grab locations
	screenUniformLocation = gl.getUniformLocation(program, "u_screen");
	cameraUniformLocation = gl.getUniformLocation(program, "u_camera_center");
	positionAttributeLocation = gl.getAttribLocation(program, "a_position");
	colorAttributeLocation = gl.getAttribLocation(program, "a_color");

	// Create buffers
	positionBufferId = makeBuffer(gl);
	colorBufferId = makeBuffer(gl);
}

export function drawTriangles(triangleData: CWTriangle[], camera: {x: number, y: number}) {
	const width = canvas.width;
	const height = canvas.height;

	// Set the viewport
	gl.viewport(0, 0, width, height);

	// Set the constants
	gl.uniform2f(screenUniformLocation, width, height);
	gl.uniform2f(cameraUniformLocation, camera.x, camera.y);

	// Some quick pre-processing to separate positions from colors
	const trianglePositions = triangleData.map(tri => tri.coords).flat(2);
	const triangleColors = triangleData.map(tri => Array(3).fill(tri.color)).flat(2);

	// Clear the canvas (not sure this is actually needed)
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
