import { getAttachedCanvas } from "./core/dom.ts";
import { ExpandingTextCanvas } from "./text/ExpandingTextCanvas.ts";
import { assignBuffer, createProgram, createShader, getGl, makeBuffer, setData } from "./webgl/webglUtils.ts";
import textVertexShaderSource from "./text/webgl/generated/textVertexShader.ts";
import textFragmentShaderSource from "./text/webgl/generated/textFragmentShader.ts";

initGame();

export function initGame() {
	webglInit();
	requestAnimationFrame(gameLoop);
}

let gl: WebGLRenderingContext;

function webglInit() {
	//
}

function gameLoop() {
	// requestAnimationFrame(gameLoop);

	// Get the text texture
	const expandingTexture = new ExpandingTextCanvas();
	expandingTexture.addLetter("A");

	// Get the real canvas we will use WebGL on
	const canvas = getAttachedCanvas();
	gl = getGl(canvas);

	// Build the 2 shaders and link them into a program
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, textVertexShaderSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, textFragmentShaderSource);
	const program = createProgram(gl, vertexShader, fragmentShader);
	gl.useProgram(program);

	// Grab locations
	const screenPositionAttributeLocation = gl.getAttribLocation(program, "a_screen_position");
	const texPositionAttributeLocation = gl.getAttribLocation(program, "a_tex_position");

	// Create buffers
	const screenPositionBufferId = makeBuffer(gl);
	const texPositionBufferId = makeBuffer(gl);

	// Set the attributes
	assignBuffer(gl, screenPositionBufferId, screenPositionAttributeLocation, 2);
	assignBuffer(gl, texPositionBufferId, texPositionAttributeLocation, 2);

	// Load the attributes
	setData(gl, screenPositionBufferId, [
		0.2, 0.2,
		0.8, 0.2,
		0.2, 0.8,
		0.2, 0.8,
		0.8, 0.2,
		0.8, 0.8
	]);

	setData(gl, texPositionBufferId, [
		0.0, 0.0,
		1.0, 0.0,
		0.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		1.0, 1.0
	]);

	// Create texture buffer
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the parameters so we can render any size image.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	// Upload the image into the texture.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, expandingTexture.getTexture());

	// Draw the triangles
	gl.drawArrays(gl.TRIANGLES, 0, 2);
}
