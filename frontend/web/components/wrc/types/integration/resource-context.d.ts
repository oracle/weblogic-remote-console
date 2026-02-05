import { ojDialog } from "ojs/ojdialog";
import { ojMessage } from "ojs/ojmessage";
import { RefObject } from "preact";
export type RouterController = {
    navigateToAbsolutePath(path: string, options?: any): void;
    selectRoot(root: string): void;
};
export type ApplicationController = {
    resetDisplay(): void;
};
export type ResourceContext = {
    canExitCallBack?: (action: string, options?: any) => {};
    routerController?: RouterController;
    applicationController?: ApplicationController;
    broadcastMessage?: (message: ojMessage.Message) => {};
    startActionPolling?: (actionPolling: {
        interval: number;
        maxPolls: number;
    }) => {};
    updateShoppingCart?: (eventType: string) => {};
};
export declare class ModalDialogResourceContext implements ResourceContext {
    dialogRef: RefObject<ojDialog>;
    constructor(dialogRef: RefObject<ojDialog>);
    get routerController(): RouterController;
}
