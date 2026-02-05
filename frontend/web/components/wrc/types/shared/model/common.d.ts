import { Action, PDJ, Polling } from "../typedefs/pdj";
import { PropertyValueHolder, RDJ, Reference } from "../typedefs/rdj";
export declare class Model {
    rdjUrl: string;
    pdjUrl: string | undefined;
    baseUrl: string | undefined;
    rdj: RDJ;
    pdj: PDJ;
    constructor(rdj: RDJ, pdj: PDJ);
    getActions(): Action[] | undefined;
    invokeAction(action: Action, references?: Reference[] | string[]): Promise<any>;
    invokeActionInputAction(changes: Record<string, PropertyValueHolder>, rows?: PropertyValueHolder, files?: Record<string, File>): Promise<Response>;
    getActionFormInput(action: Action): string | undefined;
    getBreadcrumbs(): Reference[];
    getLinks(): Reference[];
    canSaveToCart: boolean;
    canSaveNow: boolean;
    canDownload: boolean;
    canSupportTokens: boolean;
    pollingDisabled: boolean;
    pollingRunning: boolean;
    refresh(): Promise<void>;
    isPolling(): boolean;
    startPolling(pollingState: Polling, callback: Function): void;
    stopPolling(): void;
    getPageTitle(): string | undefined;
}
