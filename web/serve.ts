const port = 8357;

const handler = async (req: Request): Promise<Response> => {
	const {pathname} = new URL(req.url);
	console.log(pathname);

	if (req.method == "GET" && pathname == "/") {
		const file = await Deno.open("./web/static/index.html");
		return new Response(file.readable);
	} else if (req.method == "GET" && pathname == "/app.js") {
		const file = await Deno.open("./web/bundle/app.js");
		return new Response(file.readable);
	} else if (req.method == "GET" && pathname == "/app.js.map") {
		const file = await Deno.open("./web/bundle/app.js.map");
		return new Response(file.readable);
	} else if (req.method == "GET" && pathname == "/main.css") {
		const file = await Deno.open("./web/static/main.css");
		return new Response(file.readable);
	} else {
		return new Response(null, {
			status: 404
		});
	}
};

Deno.serve(handler, {
	port
});
