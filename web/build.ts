import { buildSettings } from "../common/settings.ts";
import { esbuild } from '../deps.ts'

console.log("Starting build");

// Generate TS files from the player GLSL files
generateGlslFiles("player");
generateGlslFiles("map");
generateGlslFiles("rectangle");
generateGlslFiles("chessboard");

generateGlslFiles("structure");
generateGlslFiles("text");

// Create a JS bundle from the TS code
const options = {
	entryPoints: ['web/ts/entrypoint.ts'],
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



// Helper functions
function generateGlslFiles(name: string) {
	console.log(`Generating ${name} GLSL files`);
	wrapGlslFileContents(
		`${name}VertexShader`,
		`web/ts/webgl/${name}/glsl-source`,
		`web/ts/webgl/${name}/glsl-generated`);

	wrapGlslFileContents(
		`${name}FragmentShader`,
		`web/ts/webgl/${name}/glsl-source`,
		`web/ts/webgl/${name}/glsl-generated`);
}

function wrapGlslFileContents(filename: string, sourceDir: string, destDir: string) {
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
