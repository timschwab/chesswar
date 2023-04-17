import settings from "./settings.js";
import hooks from "./hooks.js";

let sock;
let listeners = hooks.createGroup();

function init() {
	sock = new WebSocket(settings.server);

	sock.onopen = sockOpen;
	sock.onmessage = sockMessage;
	sock.onerror = sockError;
	sock.onclose = sockClose;
}

function sockOpen(event) {
	//
}

function sockMessage(event) {
	let data = event.data;
	let str = data.toString();
	let obj = JSON.parse(str);

	listeners.run(obj.type, obj.value, () => {
		console.warn("No listener found for message type: " + obj.type);
	});
}

function sockError(event) {
	console.error(event);
}

function sockClose(event) {
	console.warn(event);
}

function send(obj) {
	sock.send(JSON.stringify(obj));
}

function listen(type, callback) {
	listeners.register(type, callback);
}

export default { init, listen, send };
