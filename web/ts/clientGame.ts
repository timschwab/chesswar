import { createHtmlCanvas } from "./dom.ts";
import { CWTriangle, drawTriangles, webglInit } from "./webglRender.ts";


// Get the basic context
const width = globalThis.innerWidth;
const height = globalThis.innerHeight;

const canvas = createHtmlCanvas();
canvas.width = width;
canvas.height = height;

webglInit(canvas);

const triangleData = [
	{
		coords: [
			[0, 0],
			[100, 0],
			[0, 100]
		],
		color: [Math.random(), Math.random(), Math.random()]
	},
	{
		coords: [
			[width-0, 0],
			[width-100, 0],
			[width-0, 100]
		],
		color: [Math.random(), Math.random(), Math.random()]
	},
	{
		coords: [
			[0, height-0],
			[100, height-0],
			[0, height-100]
		],
		color: [Math.random(), Math.random(), Math.random()]
	},
	{
		coords: [
			[width-0, height-0],
			[width-100, height-0],
			[width-0, height-100]
		],
		color: [Math.random(), Math.random(), Math.random()]
	},
] as CWTriangle[];

const camera = {
	x: width/2,
	y: height/2
};

requestAnimationFrame(render);

function render() {
	requestAnimationFrame(render);

	camera.x++;
	camera.y++;

	drawTriangles(triangleData, camera);
}
