import { PlayerRole } from "../../common/data-types/base.ts";
import { ClientMessageTypes } from "../../common/message-types/client.ts";
import { Point } from "../../common/shapes/Point.ts";
import { clickedButton, clickedSquare } from "./generalWindow.ts";
import socket from "./socket.ts";
import state, { isSafeState } from "./state.ts";

export function receiveClick(location: Point): void {
	if (!isSafeState(state)) {
		return;
	}

	if (state.self.role != PlayerRole.GENERAL) {
		return;
	}

	const button = clickedButton(state, location);
	const square = clickedSquare(state, location);
	if (button != null) {
		state.general.selectedButton = button;
		state.general.selectedFrom = null;
	} else if (state.general.selectedButton != null && square != null) {
		if (state.general.selectedFrom) {
			// Send orders
			const payload = {
				briefing: state.general.selectedButton,
				move: {
					team: state.self.team,
					from: state.general.selectedFrom,
					to: square
				}
			};
			socket.send({
				type: ClientMessageTypes.GENERAL_ORDERS,
				payload
			});

			// Clear state
			state.general.selectedButton = null;
			state.general.selectedFrom = null;
		} else {
			state.general.selectedFrom = square;
		}
	}
}
