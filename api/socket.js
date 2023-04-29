import slim from "../common/slim-id.ts";
import hooks from "../common/hooks.ts"

let connections = {};
let events = hooks.createGroup();
let messages = hooks.createGroup();

async function newConnection(sock) {
	const id = await slim.make();

	sock.onopen = function() {
		console.log("--- connection ---");
		console.log();

		connections[id] = sock;

		events.run("add", id);
	}

	sock.onmessage = function(event) {
		let str = event.data;
		console.log("--- message ---");
		console.log(str);
		console.log();

		let obj = JSON.parse(str);
		let payload = {
			id,
			value: obj.value
		};

		messages.run(obj.type, payload, () => {
			console.warn("No listener found for message type: " + obj.type);
		});
	};

	sock.onerror = function(error) {
		console.log("--- error ---");
		console.log(error);
		console.log();

		delete connections[id];
		events.run("remove", id);
	};

	sock.onclose = function() {
		console.log("--- close ---");
		console.log();

		delete connections[id];
		events.run("remove", id);
	};
}

function listenEvent(type, callback) {
	events.register(type, callback);
}

function listenMessage(type, callback) {
	messages.register(type, (obj) => {
		callback(obj.id, obj.value);
	});
}

function send(id, type, value) {
	let str = JSON.stringify({
		type,
		value
	});

	connections[id].send(str);
}

function broadcast(type, value) {
	let str = JSON.stringify({
		type,
		value
	});

	for (let conn of Object.values(connections)) {
		conn.send(str);
	}
}

export default {
	newConnection,
	listen: {
		event: listenEvent,
		message: listenMessage
	},
	send,
	broadcast
};
