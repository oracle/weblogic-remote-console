/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import "oj-c/button";
import { useEffect, useRef, useState } from "preact/hooks";
import { ojDialog } from "ojs/ojdialog";
import { ojInputText } from "ojs/ojinputtext";
import { CButtonElement } from "oj-c/button";

/**
 * SyncIntervalDialog
 * - Renders the sync-interval toolbar oj-c-button
 * - Owns the oj-dialog and opens/closes dialog
 * - Owns OK/Cancel handling, sends chosen interval to parent
 */
type Props = Readonly<{
  syncEnabled: boolean;
  onSyncIntervalSet: (intervalSeconds: number) => void;
}>;

const SyncIntervalDialog = ({ syncEnabled, onSyncIntervalSet }: Props) => {
  const [syncInterval, setSyncInterval] = useState(0);

  const dialogRef = useRef<ojDialog>(null);
  const inputRef = useRef<ojInputText>(null);
  const okButtonRef = useRef<CButtonElement>(null);
  
  useEffect(() => {
    inputRef.current!.addEventListener('keyup', handleKeyUp);
    return () => {
      inputRef.current!.removeEventListener('keyup', handleKeyUp);
    };
  }, [inputRef, okButtonRef]);

  const handleKeyUp = (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.key == 'Enter') okButtonRef.current!.click();
  }

  const openDialog = (event?: any) => {
    if (event?.preventDefault) event.preventDefault();
    const dlg = dialogRef.current;
    if (dlg && typeof dlg.open === "function") {
      dlg.open();
    }
  };

  const closeDialog = () => {
    const dlg = dialogRef.current;
    if (dlg && typeof dlg.close === "function") {
      dlg.close();
    }
  };

  const viewSyncInterval = (syncInterval: number) => {
    return ((syncInterval <= 0) ? "" : `${syncInterval}`);
  };

  const sanityCheckInput = (syncInterval: string) => {
    if (syncInterval === "") return "0";
    const value = parseInt(syncInterval);
    if (isNaN(value)) return "0";
    return value <= 0 ? "0" : `${value}`;
  };

  const okHandler = (event: CButtonElement.ojAction) => {
    event.preventDefault();
    closeDialog();
    // Get new value and change interval
    const inputEl = inputRef.current;
    const inputValue = inputEl ? inputEl.value ?? "" : "";
    const sanitized = sanityCheckInput(`${inputValue}`);
    const newSyncInterval = parseInt(sanitized);
    if (typeof onSyncIntervalSet === "function") {
      setSyncInterval(newSyncInterval);
      onSyncIntervalSet(newSyncInterval);
    }
  };

  const cancelHandler = (event: CButtonElement.ojAction) => {
    event.preventDefault();
    closeDialog();
    // Restore the current sync interval for display
    const inputEl = inputRef.current;
    if (inputEl) inputEl["value"] = viewSyncInterval(syncInterval);
  };

  const syncIntervalTooltip = t["wrc-form-toolbar"].icons.syncInterval.tooltip;

  return (
    <>
      <div id="sync-interval-toolbar-icon" class="oj-flex-item">
        <oj-c-button
          chroming="borderless"
          onojAction={openDialog}
          disabled={!syncEnabled}
          tooltip={syncIntervalTooltip}
          aria-label={syncIntervalTooltip}
          data-testid="sync-interval"
        >
          <span slot="startIcon" class="oj-ux-ico-reset"></span>
        </oj-c-button>
      </div>

      <oj-dialog
        ref={dialogRef}
        id="syncIntervalDialog"
        dialog-title={t["wrc-sync-interval"].dialogSync.title}
        initial-visibility="hide"
        cancel-behavior="icon"
      >
        <div slot="body">
          <div
            id="sync-interval-instructions"
            aria-label={t["wrc-sync-interval"].dialogSync.instructions}
            class="cfe-dialog-prompt"
          >
            <span>{t["wrc-sync-interval"].dialogSync.instructions}</span>
          </div>

          <oj-form-layout label-edge="start" label-width="72%">
            <oj-label slot="label" for="interval-field">
              <span>
                {t["wrc-sync-interval"].dialogSync.fields.interval.label}
              </span>
            </oj-label>
            <oj-input-text id="interval-field" ref={inputRef}
                           value={viewSyncInterval(syncInterval)} />
          </oj-form-layout>
        </div>

        <div slot="footer">
          <oj-c-button ref={okButtonRef} id="dlgOkBtn1" label={t["wrc-common"].buttons.ok.label} onojAction={okHandler}>
            <span class="button-label">{t["wrc-common"].buttons.ok.label}</span>
          </oj-c-button>
          <oj-c-button id="dlgCancelBtn1" label={t["wrc-common"].buttons.cancel.label} onojAction={cancelHandler}>
            <span class="button-label">
              {t["wrc-common"].buttons.cancel.label}
            </span>
          </oj-c-button>
        </div>
      </oj-dialog>
    </>
  );
};

export default SyncIntervalDialog;
