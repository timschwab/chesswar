import { buildSettings } from "../common/settings.ts";
import { esbuild } from '../deps.ts'

const options = {
	entryPoints: ['web/ts/clientGame.ts'],
	outdir: buildSettings.bundleDir,
	target: 'esnext',
	bundle: true,
	minify: true,
	sourcemap: true
};

await esbuild.build(options);
esbuild.stop()
