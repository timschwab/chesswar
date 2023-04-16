const port = 8357;

const handler = (_req: Request): Response => {
	return new Response("hi");
};

Deno.serve(handler, {
	port
});
