import { Optional } from "../../../../../common/data-structures/Optional.ts";
import { BriefingName } from "../../../../../common/data-types/facility.ts";
import { rensets } from "../../../../../common/settings.ts";
import { Point } from "../../../../../common/shapes/Point.ts";
import { Rect } from "../../../../../common/shapes/Rect.ts";
import { CWScreen } from "../../../core/CWScreen.ts";

export interface ImportantValuesBundle {
    windowRect: Rect,
    boardRect: Rect,
    [BriefingName.ONE]: Rect,
    [BriefingName.TWO]: Rect,
    [BriefingName.THREE]: Rect
}

export class GeneralWindowHelper {
    private cachedImportantValues: Optional<ImportantValuesBundle> = Optional.empty();

    constructor(screen: CWScreen) {
        screen.subscribe(screenValue => {
            this.cachedImportantValues = Optional.of(this.computeImportantValues(screenValue));
        });
    }

    private computeImportantValues(screenRect: Rect): ImportantValuesBundle {
        const genwin = rensets.generalWindow;

        const padding = genwin.padding;
        const squareSize = genwin.squareSize;
        const buttonSize = genwin.buttonSize;

        const boardSize = squareSize*8;
        const windowWidth = padding + boardSize + padding + buttonSize + padding;
        const windowHeight = padding + boardSize + padding;

        const middleX = screenRect.width/2;
        const middleY = screenRect.height/2;

        const topLeftX = middleX - windowWidth/2;
        const topLeftY = middleY - windowHeight/2;
        const bottomRightX = middleX + windowWidth/2;
        const bottomRightY = middleY + windowHeight/2;

        const windowRectRaw = new Rect(new Point(topLeftX, topLeftY), new Point(bottomRightX, bottomRightY));
        const windowRect = windowRectRaw.floor();

        const boardTopLeftX = topLeftX + padding;
        const boardTopLeftY = topLeftY + padding;
        const boardRect = new Rect(new Point(boardTopLeftX, boardTopLeftY), new Point(topLeftX+boardSize+padding, topLeftY+boardSize+padding));

        const buttonX = topLeftX + padding + boardSize + padding;
        const button1Y = topLeftY + padding;
        const button2Y = middleY - buttonSize/2;
        const button3Y = bottomRightY - padding - buttonSize;

        const button1Rect = new Rect(new Point(buttonX, button1Y), new Point(buttonX+buttonSize, button1Y+buttonSize));
        const button2Rect = new Rect(new Point(buttonX, button2Y), new Point(buttonX+buttonSize, button2Y+buttonSize));
        const button3Rect = new Rect(new Point(buttonX, button3Y), new Point(buttonX+buttonSize, button3Y+buttonSize));

        return {
            windowRect,
            boardRect,
            [BriefingName.ONE]: button1Rect,
            [BriefingName.TWO]: button2Rect,
            [BriefingName.THREE]: button3Rect
        }
    }

    getImportantValues(): Optional<ImportantValuesBundle> {
        return this.cachedImportantValues;
    }
}
