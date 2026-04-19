import { localApiServer } from "../common/settings.ts";
import { ServerGame } from "./ServerGame.ts";

const game = new ServerGame();
game.start();

const handler = function(req: Request): Response {
	const {pathname} = new URL(req.url);

	if (pathname !== "/") {
		return new Response(null, {
			status: 404
		});
	}

	if (req.headers.get("upgrade") !== "websocket") {
		return new Response("Gimme a websocket bruv", { status: 400 });
	}

	const { socket: sock, response } = Deno.upgradeWebSocket(req);
	game.newConnection(sock);
	return response;
};

console.log(Deno.version);

Deno.serve({
	port: localApiServer.port,
	hostname: "0.0.0.0"
}, handler);
