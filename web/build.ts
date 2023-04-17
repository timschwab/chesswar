import { build, stop } from 'esbuild/mod.js'

let sourcemap;
const mode = Deno.args[0];
if (mode == "dev") {
	sourcemap = true;
} else if (mode == "prod") {
	sourcemap = false;
}

const options = {
	entryPoints: ['web/spa/app.ts'],
	outdir: 'web/bundle',
	target: 'esnext',
	bundle: true,
	minify: true,
	sourcemap
};

await build(options);

stop()
