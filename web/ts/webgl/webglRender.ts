import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Triangle } from "../../../common/shapes/Triangle.ts";
import { screenChange, screenValue } from "../core/screen.ts";
import { createHtmlCanvas } from "../dom.ts";
import fragmentShaderSource from "./generated/fragmentShader.ts";
import vertexShaderSource from "./generated/vertexShader.ts";
import { assignBuffer, createProgram, createShader, getGl, makeBuffer, setData } from "./webglUtils.ts";

let canvas: HTMLCanvasElement;
let gl: WebGLRenderingContext;

let screenUniformLocation: WebGLUniformLocation | null;
let cameraUniformLocation: WebGLUniformLocation | null;
let positionAttributeLocation: number;
let colorAttributeLocation: number;
let positionBufferId: WebGLBuffer;
let colorBufferId: WebGLBuffer;

screenChange(handleScreenChange);
function handleScreenChange(rect: Rect) {
	const width = rect.right;
	const height = rect.bottom;

	// Set the canvas
	canvas.width = width;
	canvas.height = height;

	// Set the viewport
	gl.viewport(0, 0, width, height);

	// Set the uniform
	gl.uniform2f(screenUniformLocation, width, height);
}

export function webglInit() {
	canvas = createHtmlCanvas();
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

	// Set the attributes
	assignBuffer(gl, positionBufferId, positionAttributeLocation, 2);
	assignBuffer(gl, colorBufferId, colorAttributeLocation, 3);

	// Set width/height
	handleScreenChange(screenValue);
}

export function drawTriangles(triangleData: Triangle[], camera: Point) {
	// Set the uniform
	gl.uniform2f(cameraUniformLocation, camera.x, camera.y);

	// Some quick pre-processing to separate positions from colors
	const trianglePositions = triangleData.flatMap(tri => tri.verticesArray());
	const triangleColors = triangleData.flatMap(tri => tri.colorArray());

	// Load the data
	setData(gl, positionBufferId, trianglePositions);
	setData(gl, colorBufferId, triangleColors);

	// Draw the triangles
	gl.drawArrays(gl.TRIANGLES, 0, triangleData.length*3);
}
