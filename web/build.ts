import { buildSettings } from "../common/settings.ts";
import { esbuild } from '../deps.ts'

await build();



async function build() {
	console.log("Starting build");

	// Generate TS files from the GLSL files. One day Deno/TS should support loading GLSL natively.
	generateAllGlslFiles([
		"player",
		"map",
		"rectangle",
		"text",
		"chessPiece"
	]);

	// Create a JS bundle from the TS code
	await generateJsBundle("web/ts/entrypoint.ts");

	console.log("Finished build");
}

function generateAllGlslFiles(names: string[]) {
	for (const name of names) {
		generateOneGlslFileSet(name);
	}
}

function generateOneGlslFileSet(name: string) {
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

async function generateJsBundle(entrypoint: string) {
	// Create a JS bundle from the TS code
	console.log("Creating JS bundle");

	const options = {
		entryPoints: [entrypoint],
		outdir: buildSettings.bundleDir,
		target: "esnext",
		bundle: true,
		minify: true,
		sourcemap: true,
		plugins: []
	};

	await esbuild.build(options);
	esbuild.stop();
}
