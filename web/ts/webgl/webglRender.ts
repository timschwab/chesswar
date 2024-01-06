import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Structure } from "../../../common/shapes/Structure.ts";
import { screenChange, screenValue } from "../core/screen.ts";
import { createHtmlCanvas } from "../dom.ts";
import fragmentShaderSource from "./generated/fragmentShader.ts";
import vertexShaderSource from "./generated/vertexShader.ts";
import { assignBuffer, createProgram, createShader, getGl, makeBuffer, setData } from "./webglUtils.ts";

let canvas: HTMLCanvasElement;
let gl: WebGLRenderingContext;

let scaleBufferId: WebGLBuffer;
let structureBufferId: WebGLBuffer;
let vertexBufferId: WebGLBuffer;
let colorBufferId: WebGLBuffer;

let screenUniformLocation: WebGLUniformLocation | null;
let cameraUniformLocation: WebGLUniformLocation | null;

let scaleAttributeLocation: number;
let structureAttributeLocation: number;
let vertextAttributeLocation: number;
let colorAttributeLocation: number;

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

	scaleAttributeLocation = gl.getAttribLocation(program, "a_scale");
	structureAttributeLocation = gl.getAttribLocation(program, "a_structure_center");
	vertextAttributeLocation = gl.getAttribLocation(program, "a_vertex");
	colorAttributeLocation = gl.getAttribLocation(program, "a_color");

	// Create buffers
	scaleBufferId = makeBuffer(gl);
	structureBufferId = makeBuffer(gl);
	vertexBufferId = makeBuffer(gl);
	colorBufferId = makeBuffer(gl);

	// Set the attributes
	assignBuffer(gl, scaleBufferId, scaleAttributeLocation, 1);
	assignBuffer(gl, structureBufferId, structureAttributeLocation, 2);
	assignBuffer(gl, vertexBufferId, vertextAttributeLocation, 2);
	assignBuffer(gl, colorBufferId, colorAttributeLocation, 3);

	// Set width/height
	handleScreenChange(screenValue);
}

export function drawStructures(structures: Structure[], camera: Point) {
	// Set the uniform
	gl.uniform2f(cameraUniformLocation, camera.x, camera.y);

	// Some quick pre-processing to separate attributes
	const triangleScales = structures.flatMap(struct => struct.scaleArray());
	const triangleStructures = structures.flatMap(struct => struct.structureArray());
	const triangleVertices = structures.flatMap(struct => struct.verticesArray());
	const triangleColors = structures.flatMap(tri => tri.colorArray());

	// Load the data
	setData(gl, scaleBufferId, triangleScales);
	setData(gl, structureBufferId, triangleStructures);
	setData(gl, vertexBufferId, triangleVertices);
	setData(gl, colorBufferId, triangleColors);

	// Draw the triangles
	gl.drawArrays(gl.TRIANGLES, 0, triangleScales.length);
}
