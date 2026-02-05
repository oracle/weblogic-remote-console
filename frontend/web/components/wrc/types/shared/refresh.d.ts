export declare const REFRESH_EVENT = "wrc:refresh";
export type RefreshScope = {
    content?: boolean;
    navtree?: boolean;
};
export type RefreshTarget = {
    resourceData?: string;
    root?: string;
};
export type RefreshDetail = {
    scope?: RefreshScope;
    target?: RefreshTarget;
};
export declare function emitRefresh(detail?: RefreshDetail): void;
export declare function subscribeToRefresh(callback: (detail: RefreshDetail) => void): () => void;
