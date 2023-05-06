import slim from "../common/slim-id.ts";
import hooks from "../common/hooks.ts";
import { ClientMessage, ClientMessageWithId } from "../common/message-types/types-client.ts";
import { ServerMessage } from "../common/message-types/types-server.ts";

const connections = new Map<string, WebSocket>();
const addHook = hooks.create<string>();
const removeHook = hooks.create<string>();
const messageHook = hooks.create<ClientMessageWithId>();

function newConnection(sock: WebSocket) {
	const id = slim.make();

	sock.onopen = function() {
		console.log("--- connection ---");
		console.log();

		connections.set(id, sock);

		addHook.run(id);
	}

	sock.onmessage = function(event) {
		const str = event.data;
		console.log("--- message ---");
		console.log(str);
		console.log();

		const message = JSON.parse(str) as ClientMessage;
		const messageWithId = {...message, id};

		messageHook.run(messageWithId);
	};

	sock.onerror = function(error) {
		console.log("--- error ---");
		console.log(error);
		console.log();

		connections.delete(id);
		removeHook.run(id);
	};

	sock.onclose = function() {
		console.log("--- close ---");
		console.log();

		connections.delete(id);
		removeHook.run(id);
	};
}

function send(id: string, message: ServerMessage) {
	const conn = connections.get(id);
	if (conn) {
		conn.send(JSON.stringify(message));
	} else {
		throw "Could not find connection with id " + id;
	}
}

function broadcast(message: ServerMessage) {
	const str = JSON.stringify(message);
	for (const conn of connections.values()) {
		conn.send(str);
	}
}

export default {
	newConnection,
	listen: {
		add: addHook.register,
		remove: removeHook.register,
		message: messageHook.register
	},
	send,
	broadcast
};
