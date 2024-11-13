import { buildSettings } from "../common/settings.ts";
import { esbuild } from '../deps.ts'

console.log("Starting build");

// Generate TS files from the shape GLSL files
console.log("Generating shape fragment shader TS");
generateGlslFile(
	"web/ts/webgl/shape/glsl-source/shapeFragmentShader.glsl",
	"web/ts/webgl/shape/glsl-generated/shapeFragmentShader.ts");

console.log("Generating shape vertex shader TS");
generateGlslFile(
	"web/ts/webgl/shape/glsl-source/shapeVertexShader.glsl",
	"web/ts/webgl/shape/glsl-generated/shapeVertexShader.ts");

// Generate TS files from the text GLSL files
console.log("Generating text fragment shader TS");
generateGlslFile(
	"web/ts/webgl/text/glsl-source/textFragmentShader.glsl",
	"web/ts/webgl/text/glsl-generated/textFragmentShader.ts");

console.log("Generating text vertex shader TS");
generateGlslFile(
	"web/ts/webgl/text/glsl-source/textVertexShader.glsl",
	"web/ts/webgl/text/glsl-generated/textVertexShader.ts");

// Create a JS bundle from the TS code
const options = {
	entryPoints: ['web/ts/clientGame.ts'],
	outdir: buildSettings.bundleDir,
	target: 'esnext',
	bundle: true,
	minify: true,
	sourcemap: true,
	plugins: []
};

console.log("Creating JS bundle");
await esbuild.build(options);
esbuild.stop();

console.log("Finished build");



// Helper function
function generateGlslFile(sourcePath: string, destPath: string) {
	const contents = Deno.readTextFileSync(sourcePath);
	const escapedContents = contents.replaceAll("`", "\\`");
	const wrappedContents = `/*
**************************************************
***** THIS FILE IS GENERATED. DO NOT MODIFY. *****
**************************************************
*/

const contents = \`${escapedContents}\`;

export default contents;
`;

	Deno.writeTextFileSync(destPath, wrappedContents);
}
