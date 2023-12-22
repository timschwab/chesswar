import { buildSettings } from "../common/settings.ts";
import { esbuild, esbuildPluginGlsl } from '../deps.ts'

const options = {
	entryPoints: ['web/ts/clientGame.ts'],
	outdir: buildSettings.bundleDir,
	target: 'esnext',
	bundle: true,
	minify: true,
	sourcemap: true,
	plugins: [esbuildPluginGlsl.glsl()]
};

await esbuild.build(options);
