import { Optional } from "../../../common/data-structures/Optional.ts";
import { PlayerRole, TeamName } from "../../../common/data-types/base.ts";
import { ChessCoordinate } from "../../../common/data-types/chess.ts";
import { BriefingName } from "../../../common/data-types/facility.ts";
import { ClientMessageTypes } from "../../../common/message-types/client.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { CWClientSocket } from "../core/CWClientSocket.ts";
import { CWInput } from "../core/CWInput.ts";
import { CWScreen } from "../core/CWScreen.ts";
import { GeneralWindowHelper, ImportantValuesBundle } from "../render/component-renderers/GeneralWindowHelper.ts";
import { ChesswarState } from "./ChesswarState.ts";

export class ClickEventHandler {
    private readonly input: CWInput;
    private readonly genwinHelper: GeneralWindowHelper;
    private readonly state: ChesswarState;
    private readonly socket: CWClientSocket;

    constructor(state: ChesswarState, input: CWInput, screen: CWScreen, socket: CWClientSocket) {
        this.input = input;
        this.genwinHelper = new GeneralWindowHelper(screen);
        this.state = state;
        this.socket = socket;
    }

    start() {
        this.input.listenClick(this.handleClickEvent.bind(this));
    }

    private handleClickEvent(click: Point): void {
        this.state.getSelfPlayer().ifPresent(selfPlayer => {
            if (selfPlayer.role === PlayerRole.GENERAL) {
                this.genwinHelper.getImportantValues().ifPresent(
                    importantValues => this.handleGeneralClick(click, importantValues, selfPlayer.team));
            }
        });
    }

    private handleGeneralClick(location: Point, importantValues: ImportantValuesBundle, team: TeamName) {
        const button = this.clickedButton(location, importantValues);
        const square = this.clickedSquare(location, importantValues);

        if (button.isPresent()) {
            this.state.setGeneralSelectedButton(button);
        } else if (square.isPresent()) {
            if (this.state.getGeneralSelectedFrom().isPresent()) {
                // Send orders
                const payload = {
                    briefing: this.state.getGeneralSelectedButton().get(),
                    move: {
                        team: team,
                        from: this.state.getGeneralSelectedFrom().get(),
                        to: square.get()
                    }
                };

                this.socket.socketSend({
                    type: ClientMessageTypes.GENERAL_ORDERS,
                    payload
                });

                // Reset state
                this.state.setGeneralSelectedButton(Optional.empty());
                this.state.setGeneralSelectedFrom(Optional.empty());
            } else {
                // Set the from
                this.state.setGeneralSelectedFrom(square);
            }
        }
    }

    private clickedButton(location: Point, importantValues: ImportantValuesBundle): Optional<BriefingName> {
        if (location.inside(importantValues[BriefingName.ONE])) {
            return Optional.of(BriefingName.ONE);
        } else if (location.inside(importantValues[BriefingName.TWO])) {
            return Optional.of(BriefingName.ONE);
        } else if (location.inside(importantValues[BriefingName.THREE])) {
            return Optional.of(BriefingName.ONE);
        }

        return Optional.empty();
    }

    private clickedSquare(location: Point, importantValues: ImportantValuesBundle): Optional<ChessCoordinate> {
        if (!location.inside(importantValues.boardRect)) {
            return Optional.empty();
        }

        const cornerPoint = location.subtract(importantValues.boardRect.leftTop);
        const squareSize = importantValues.boardRect.width/8;
        const rank = Math.floor(cornerPoint.y / squareSize);
        const file = Math.floor(cornerPoint.x / squareSize);

        return Optional.of({
            rank,
            file
        });
    }
}
