/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
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

/**
 * Provides a context for managing resources within a modal dialog, specifically
 * handling navigation by closing the dialog when finished
 */
export class ModalDialogResourceContext implements ResourceContext {
  dialogRef: RefObject<ojDialog>;

  constructor(dialogRef: RefObject<ojDialog>) {
    this.dialogRef = dialogRef;
  }

  get routerController(): RouterController {
    return {
      selectRoot: () => {},
      navigateToAbsolutePath: (_path: string, _options?: any) => {
        this.dialogRef?.current!.close();
      },
    };
  }
}
