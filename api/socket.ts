import slim from "../common/slim-id.ts";
import { createHook } from "../common/hooks.ts";
import { ClientMessage, ClientMessageWithId } from "../common/message-types/client.ts";
import { ServerMessage } from "../common/message-types/server.ts";
import { ChesswarId } from "../common/data-types/base.ts";

const connections = new Map<ChesswarId, WebSocket>();
const addHook = createHook<string>();
const removeHook = createHook<string>();
const messageHook = createHook<ClientMessageWithId>();

function newConnection(sock: WebSocket) {
	const id: ChesswarId = slim.make();

	sock.addEventListener("open", function() {
		console.log(`--- ${id} connection ---`);
		console.log();

		connections.set(id, sock);

		addHook.run(id);
	});

	sock.addEventListener("message", function(event: MessageEvent) {
		const str = event.data;
		console.log(`--- ${id} message ---`);
		console.log(str);
		console.log();

		const message = JSON.parse(str) as ClientMessage;
		const messageWithId = {...message, id};

		messageHook.run(messageWithId);
	});

	sock.addEventListener("error", function(error: Event) {
		console.log(`--- ${id} error ---`);
		console.log(error);
		console.log();

		// All errors will result in a close, so don't clean up the connection here
	});

	sock.addEventListener("close", function(closeEvent: CloseEvent) {
		console.log(`--- ${id} close ---`);
		console.log(closeEvent);
		console.log();

		connections.delete(id);
		removeHook.run(id);
	});
}

function sendOne(id: ChesswarId, message: ServerMessage) {
	const conn = connections.get(id);
	if (conn) {
		safeSend(conn, JSON.stringify(message));
	} else {
		throw "Could not find connection with id " + id;
	}
}

function sendBulk(ids: ChesswarId[], message: ServerMessage) {
	const str = JSON.stringify(message);
	for (const id of ids) {
		const conn = connections.get(id);
		if (conn) {
			safeSend(conn, str);
		} else {
			throw "Could not find connection with id " + id;
		}
	}
}

function sendAll(message: ServerMessage) {
	const str = JSON.stringify(message);
	for (const conn of connections.values()) {
		safeSend(conn, str);
	}
}

function safeSend(conn: WebSocket, message: string) {
	try {
		conn.send(message);
	} catch (err) {
		console.error({message, err});
	}
}

export default {
	newConnection,
	listen: {
		add: addHook.register,
		remove: removeHook.register,
		message: messageHook.register
	},
	sendOne,
	sendBulk,
	sendAll
};
