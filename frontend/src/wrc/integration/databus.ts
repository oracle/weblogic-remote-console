import { ResourceData } from "wrc/nav-tree/types";
import { StatusData } from "wrc/shared/typedefs/rdj";
import type signals = require("signals");



export interface Providers {
    current:   Current;
    providers: ResourceData[];
}

export interface Current {
    lastRootUsed: string;
    state:        string;
    roots:        Root[];
}

export interface Root {
    name:           string;
    label:          string;
    description:    string;
    navtree:        string;
    simpleSearch:   string;
    changeManager?: string;
    actionsEnabled: boolean;
    readOnly?:      boolean;
}

export interface Shoppingcart {
    state:        string;
    resourceData: string;
}

type CallbackFunction = (event: StatusData) => void;

export type Databus = {
    subscribe(callback: CallbackFunction): signals.SignalBinding;
    get(): signals.Signal;
}
