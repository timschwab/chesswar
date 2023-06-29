import { buildSettings, localWebServer } from "../common/settings.ts";

const handler = async (req: Request): Promise<Response> => {
	const {pathname} = new URL(req.url);
	console.log(pathname);

	let file, contentType = "";
	if (req.method == "GET" && pathname == "/") {
		file = await Deno.open("web/static/index.html");
		contentType = "text/html";
	} else if (req.method == "GET" && pathname == "/main.css") {
		file = await Deno.open("web/static/main.css");
		contentType = "text/css";
	}else if (req.method == "GET" && pathname == "/app.js") {
		file = await Deno.open(buildSettings.bundleDir + "/app.js");
		contentType = "application/javascript";
	} else if (req.method == "GET" && pathname == "/app.js.map") {
		file = await Deno.open(buildSettings.bundleDir + "/app.js.map");
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

Deno.serve({
	port: localWebServer.port,
	hostname: "0.0.0.0"
}, handler);
