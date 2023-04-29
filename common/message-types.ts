interface AbstractMessage<T, P> {
	type: T,
	payload: P
}

type PlayerInitMessageType = "player-init";
export type PlayerInitMessagePayload = {
	id: string
}
type PlayerInitMessage = AbstractMessage<PlayerInitMessageType, PlayerInitMessagePayload>;


type StateMessageType = "state";
export type StateMessagePayload = {
	player: string,
	position: {
		x: number,
		y: number
	}
}[];
type StateMessage = AbstractMessage<StateMessageType, StateMessagePayload>;

export type ServerMessage = PlayerInitMessage | StateMessage;

type KeysMessageType = "keys";
export type KeysMessagePayload = {
	left: boolean,
	right: boolean,
	up: boolean,
	down: boolean
}
type KeysMessage = AbstractMessage<KeysMessageType, KeysMessagePayload>;

type ClientMessage = KeysMessage;
export type ClientMessageWithId = KeysMessage & { id: string }
