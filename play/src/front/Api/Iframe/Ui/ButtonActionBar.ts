import { AddButtonActionBarEvent } from "../../Events/Ui/ButtonActionBarEvent";
import { IframeApiContribution, sendToWorkadventure } from "../IframeApiContribution";
import { apiCallback } from "../registeredCallbacks";

export type ButtonActionBarClickedCallback = (buttonActionBar: AddButtonActionBarEvent) => void;

export class WorkAdventureButtonActionBarCommands extends IframeApiContribution<WorkAdventureButtonActionBarCommands> {
    private _callbacks: Map<string, ButtonActionBarClickedCallback> = new Map<string, ButtonActionBarClickedCallback>();

    callbacks = [
        apiCallback({
            type: "buttonActionBarTrigger",
            callback: (event) => {
                if (this._callbacks.has(event.id)) {
                    (this._callbacks.get(event.id) as ButtonActionBarClickedCallback)(event);
                }
            },
        }),
    ];

    /**
     *
     * @param id
     * @param label
     * @param callback
     */
    addButtonActionBar(id: string, label: string, callback?: ButtonActionBarClickedCallback) {
        if (callback != undefined) this._callbacks.set(id, callback);
        sendToWorkadventure({
            type: "addButtonActionBar",
            data: { id, label },
        });
    }

    /**
     *
     * @param id
     */
    removeButtonActionBar(id: string) {
        this._callbacks.delete(id);
        sendToWorkadventure({ type: "removeButtonActionBar", data: { id } });
    }
}

export default new WorkAdventureButtonActionBarCommands();
