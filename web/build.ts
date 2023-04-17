import { build, stop } from 'esbuild/mod.js'

const options = {
	entryPoints: ['web/spa/app.ts'],
	outdir: 'web/bundle',
	target: 'esnext',
	bundle: true,
	minify: true,
	sourcemap: true
};

await build(options);
stop()
