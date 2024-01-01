import { buildSettings } from "../common/settings.ts";
import { esbuild } from '../deps.ts'

console.log("Starting build");

// Generate TS files from the GLSL files
console.log("Generating fragment shader TS");
generateGlslFile("web/ts/webgl/fragmentShader.glsl", "web/ts/webgl/generated/fragmentShader.ts");

console.log("Generating vertex shader TS");
generateGlslFile("web/ts/webgl/vertexShader.glsl", "web/ts/webgl/generated/vertexShader.ts");

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
