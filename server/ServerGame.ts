import { gameEngine } from "../common/settings.ts";
import { addPlayer, receiveMessage, removePlayer } from "./events.ts";
import { tick } from "./oldServerGame.ts";
import socket from "./socket.ts";

export class ServerGame {
    start() {
        // Set up events
        socket.listen.add(addPlayer);
        socket.listen.remove(removePlayer);
        socket.listen.message(receiveMessage);
    
        // Set up ticking
        setInterval(tick, gameEngine.mspt);
    }

    newConnection(sock: WebSocket) {
        socket.newConnection(sock);
    }
}
