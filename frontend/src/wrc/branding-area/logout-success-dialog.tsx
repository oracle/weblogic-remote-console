/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import "oj-c/button";
import { forwardRef } from "preact/compat";
import { useEffect, useImperativeHandle, useRef } from "preact/hooks";
import { ojDialog } from "ojs/ojdialog";
import { CButtonElement } from "oj-c/button";

const LOGOUT_SUCCESS_AUTO_RELOAD_MILLIS = 10000;

export type LogoutSuccessDialogRef = {
  open: () => void;
};

type Props = Readonly<{
  onProceed: () => void;
}>;

const LogoutSuccessDialog = forwardRef<LogoutSuccessDialogRef, Props>(({ onProceed }, ref) => {
  const dialogRef = useRef<ojDialog>(null);
  const okButtonRef = useRef<CButtonElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);
  const keyUpHandlerRef = useRef<((event: KeyboardEvent) => void) | undefined>(undefined);
  const proceededRef = useRef(false);

  const clearTimer = () => {
    if (typeof timeoutRef.current !== "undefined") {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const cleanup = () => {
    clearTimer();
    if (keyUpHandlerRef.current) {
      window.removeEventListener("keyup", keyUpHandlerRef.current);
      keyUpHandlerRef.current = undefined;
    }
  };

  const proceedAfterLogout = (event?: Event) => {
    if (event?.preventDefault) event.preventDefault();

    if (proceededRef.current) return;
    proceededRef.current = true;

    cleanup();
    onProceed();
  };

  const openDialog = () => {
    proceededRef.current = false;
    cleanup();

    keyUpHandlerRef.current = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        proceedAfterLogout();
      }
    };
    window.addEventListener("keyup", keyUpHandlerRef.current);
    timeoutRef.current = window.setTimeout(proceedAfterLogout, LOGOUT_SUCCESS_AUTO_RELOAD_MILLIS);

    const dlg = dialogRef.current;
    if (dlg && typeof dlg.open === "function") {
      dlg.open();
      requestAnimationFrame(() => okButtonRef.current?.focus());
    } else {
      proceedAfterLogout();
    }
  };

  const closeHandler = (event: ojDialog.ojClose) => {
    if (event?.target === dialogRef.current) {
      proceedAfterLogout(event);
    }
  };

  const okHandler = (event: CButtonElement.ojAction) => {
    proceedAfterLogout(event);
  };

  useImperativeHandle(ref, () => ({
    open: openDialog
  }));

  useEffect(() => cleanup, []);

  return (
    <oj-dialog
      ref={dialogRef}
      id="logoutSuccessDialog"
      dialog-title={t["wrc-header"].buttons.logout.label}
      initial-visibility="hide"
      cancel-behavior="icon"
      onojClose={closeHandler}
    >
      <div slot="body">
        <div id="logout-success-message" class="cfe-dialog-prompt">
          <span>{t["wrc-header"].messages.logoutSucceeded.value}</span>
        </div>
      </div>

      <div slot="footer">
        <oj-c-button
          ref={okButtonRef}
          id="logoutSuccessOkButton"
          label={t["wrc-common"].buttons.ok.label}
          onojAction={okHandler}
        >
          <span class="button-label">{t["wrc-common"].buttons.ok.label}</span>
        </oj-c-button>
      </div>
    </oj-dialog>
  );
});

export default LogoutSuccessDialog;