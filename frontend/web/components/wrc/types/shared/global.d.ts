import type { Databus } from "wrc/integration/databus";
export declare namespace Global {
    type GlobalState = {
        unique: string;
        databus?: Databus;
        backendPrefix?: string;
    };
    const global: GlobalState;
}
export {};
