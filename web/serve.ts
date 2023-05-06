import { buildSettings, localWebServer } from "../common/settings.ts";

const handler = async (req: Request): Promise<Response> => {
	const {pathname} = new URL(req.url);
	console.log(pathname);

	let file;
	if (req.method == "GET" && pathname == "/") {
		file = await Deno.open("web/static/index.html");
	} else if (req.method == "GET" && pathname == "/main.css") {
		file = await Deno.open("web/static/main.css");
	}else if (req.method == "GET" && pathname == "/app.js") {
		file = await Deno.open(buildSettings.bundleDir + "/app.js");
	} else if (req.method == "GET" && pathname == "/app.js.map") {
		file = await Deno.open(buildSettings.bundleDir + "/app.js.map");
	}

	if (file) {
		return new Response(file.readable);
	} else {
		return new Response(null, {
			status: 404
		});
	}
};

Deno.serve({
	port: localWebServer.port,
	hostname: "0.0.0.0"
}, handler);
