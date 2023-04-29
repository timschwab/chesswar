import game from "./game.js";
import socket from "./socket.js";

const port = 18357;

game.init();

const handler = (req: Request): Response => {
	const {pathname} = new URL(req.url);

	if (pathname != "/") {
		return new Response(null, {
			status: 404
		});
	}

	if (req.headers.get("upgrade") != "websocket") {
		return new Response("Gimme a websocket bruv", { status: 400 });
	}

	const { socket: sock, response } = Deno.upgradeWebSocket(req);
	socket.newConnection(sock);
	return response;
};

Deno.serve(handler, {
	port,
	hostname: "0.0.0.0"
});
