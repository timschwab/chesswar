import { esbuild } from '../deps.ts'

const options = {
	entryPoints: ['web/js/app.ts'],
	outdir: 'web/bundle',
	target: 'esnext',
	bundle: true,
	minify: true,
	sourcemap: true
};

await esbuild.build(options);
esbuild.stop()
