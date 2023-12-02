import { createHook } from "../../../common/hooks.ts";
import { ClientMessage } from "../../../common/message-types/client.ts";
import { ServerMessage } from "../../../common/message-types/server.ts";
import { localApiServerOrigin, remoteApiServerOrigin } from "../../../common/settings.ts";
import env, { Environment } from "./environment.ts";

const messageHook = createHook<ServerMessage>();

const origin = env == Environment.REMOTE ? remoteApiServerOrigin : localApiServerOrigin;
const sock = new WebSocket(origin);
sock.addEventListener("open", sockOpen);
sock.addEventListener("message", sockMessage);
sock.addEventListener("error", sockError);
sock.addEventListener("close", sockClose);

function sockOpen(_event: Event) {
	// Do nothing
}

function sockMessage(event: MessageEvent) {
	const data = event.data;
	const str = data.toString();
	const message = JSON.parse(str) as ServerMessage;

	messageHook.run(message);
}

function sockError(event: Event) {
	console.error(event);
}

function sockClose(event: CloseEvent) {
	console.warn(event);
}

export function socketSend(message: ClientMessage): boolean {
	return safeSend(sock, JSON.stringify(message));
}

function safeSend(conn: WebSocket, message: string): boolean {
	try {
		conn.send(message);
		return true;
	} catch (err) {
		console.error({message, err});
		return false;
	}
}

export const socketListen = messageHook.register;
