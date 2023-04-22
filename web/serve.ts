const port = 8357;

const handler = async (req: Request): Promise<Response> => {
	const {pathname} = new URL(req.url);
	console.log(pathname);

	let file;
	if (req.method == "GET" && pathname == "/") {
		file = await Deno.open("./web/static/index.html");
	} else if (req.method == "GET" && pathname == "/app.js") {
		file = await Deno.open("./web/bundle/app.js");
	} else if (req.method == "GET" && pathname == "/app.js.map") {
		file = await Deno.open("./web/bundle/app.js.map");
	} else if (req.method == "GET" && pathname == "/main.css") {
		file = await Deno.open("./web/static/main.css");
	}

	if (file) {
		return new Response(file.readable);
	} else {
		return new Response(null, {
			status: 404
		});
	}
};

Deno.serve(handler, {
	port,
	hostname: "0.0.0.0"
});
