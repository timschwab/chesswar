import { buildSettings, localWebServer } from "../common/settings.ts";

async function handler(req: Request): Promise<Response> {
	const {pathname} = new URL(req.url);
	console.log(pathname);

	let file, contentType = "";
	if (req.method == "GET" && pathname == "/") {
		file = await Deno.open("web/static/index.html");
		contentType = "text/html";
	} else if (req.method == "GET" && pathname == "/main.css") {
		file = await Deno.open("web/static/main.css");
		contentType = "text/css";
	} else if (req.method == "GET" && pathname == "/clientGame.js") {
		file = await Deno.open(buildSettings.bundleDir + "/clientGame.js");
		contentType = "application/javascript";
	} else if (req.method == "GET" && pathname == "/clientGame.js.map") {
		file = await Deno.open(buildSettings.bundleDir + "/clientGame.js.map");
		contentType = "application/json";
	}

	if (file) {
		return new Response(file.readable, {
			headers: {
				"Content-Type": contentType
			}
		});
	} else {
		return new Response(null, {
			status: 404
		});
	}
};

console.log(Deno.version);

Deno.serve({
	port: localWebServer.port,
	hostname: "0.0.0.0"
}, handler);
