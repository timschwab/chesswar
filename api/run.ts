import { localServer } from "../common/settings.ts";
import game from "./game.ts";
import socket from "./socket.ts";

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

Deno.serve({
	port: localServer.port,
	hostname: "0.0.0.0"
}, handler);
