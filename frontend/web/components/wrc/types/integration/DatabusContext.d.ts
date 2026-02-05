import type { FunctionalComponent, ComponentChildren } from 'preact';
import type { Databus } from 'wrc/integration/databus';
export declare const DatabusContext: import("preact").Context<Databus | null>;
type ProviderProps = {
    databus: Databus;
    children?: ComponentChildren;
};
export declare const DatabusProvider: FunctionalComponent<ProviderProps>;
export declare function useDatabus(): Databus;
export {};
