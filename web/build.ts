import { buildSettings } from "../common/settings.ts";
import { esbuild } from '../deps.ts'

console.log("Starting build");

// Generate TS files from the shape GLSL files
console.log("Generating shape fragment shader TS");
generateGlslFile(
	"shapeFragmentShader",
	"web/ts/webgl/shape/glsl-source",
	"web/ts/webgl/shape/glsl-generated");

console.log("Generating shape vertex shader TS");
generateGlslFile(
	"shapeVertexShader",
	"web/ts/webgl/shape/glsl-source",
	"web/ts/webgl/shape/glsl-generated");

// Generate TS files from the text GLSL files
console.log("Generating text fragment shader TS");
generateGlslFile(
	"textFragmentShader",
	"web/ts/webgl/text/glsl-source",
	"web/ts/webgl/text/glsl-generated");

console.log("Generating text vertex shader TS");
generateGlslFile(
	"textVertexShader",
	"web/ts/webgl/text/glsl-source",
	"web/ts/webgl/text/glsl-generated");

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
function generateGlslFile(filename: string, sourceDir: string, destDir: string) {
	const sourcePath = sourceDir + "/" + filename + ".glsl";
	const destPath = destDir + "/" + filename + ".ts";

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

	Deno.mkdirSync(destDir, {
		recursive: true
	});
	Deno.writeTextFileSync(destPath, wrappedContents);
}
