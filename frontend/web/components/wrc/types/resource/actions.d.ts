import "oj-c/button";
import { Model } from "../shared/model/common";
import { Action, Polling } from "../shared/typedefs/pdj";
import { Reference } from "../shared/typedefs/rdj";
import { KeySetImpl } from "ojs/ojkeyset";
type Props = {
    model: Model;
    enabledActions?: string[];
    selectedKeys?: KeySetImpl<string | Reference>;
    onActionSelected: (action: Action) => void;
    onActionPolling: (polling: Polling) => void;
};
export declare const Actions: ({ model, enabledActions, selectedKeys, onActionSelected, onActionPolling }: Props) => import("preact").JSX.Element;
export {};
