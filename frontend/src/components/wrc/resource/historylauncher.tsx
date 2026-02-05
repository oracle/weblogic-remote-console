/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 *
 * VDOM launcher for the "pages history" dialog.
 * - Uses an oj-c-button to open a dialog that embeds a wrc-resource pointed at /api/{provider}/history.
 * - Matches the MVVM dialog styling by using id="recentlyVisitedPagesDialog".
 */

import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import { useContext, useState, useRef } from "preact/hooks";

import "oj-c/button";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { Dialog } from "wrc/display/dialog";
import { Resource, UserContext } from "wrc/resource/resource";
import { ojDialog } from "ojs/ojdialog";
import Context = require("ojs/ojcontext");

function HistoryLauncherImpl() {
  const ctx = useContext(UserContext);
  const dialogRef = useRef<ojDialog | null>(null);

  const [rdjUrl, setRdjUrl] = useState<string | null>(null);

  // Tooltip aligns with MVVM: i18n.icons.pagesHistory.launch.tooltip
  const tooltip = (t as any)?.["wrc-common"]?.tooltips?.pagesHistory?.launch
    ?.value;

  const openDialog = () => {
    setRdjUrl("/api/history");

    requestAnimationFrame(() => {
      const dlg = dialogRef.current as ojDialog | null;
      if (!dlg) return;
      const bc = (Context as any).getContext(dlg).getBusyContext();
      bc.whenReady().then(() => dlg.open());
    });
  };

  const onClose = (e: ojDialog.ojClose) => {
    if (e?.target === dialogRef.current) {
      setRdjUrl(null);
    }
  };

  return (
    <div class="wrc-history-launcher">
      <oj-c-button
        id="recent-pages-iconbar-icon"
        class="size-5"
        chroming="ghost"
        tooltip={tooltip}
        aria-label={tooltip}
        onojAction={openDialog}
      >
        <span
          slot="startIcon"
          class="oj-ux-ico-clock-history"
          aria-hidden="true"
        ></span>
      </oj-c-button>

      {/* Dialog wrapper matches common Dialog styling and MVVM CSS hook id */}
      <Dialog
        id="provider-info-style-history-dialog"
        onojClose={onClose}
        ref={dialogRef}
      >
        <div slot="body" class="oj-bg-body">
          {/* Embed the resource that renders the pages history content */}
          <Resource rdj={rdjUrl || ""} context={ctx?.context} />
        </div>
      </Dialog>
    </div>
  );
}

export const HistoryLauncher: ComponentType<
  ExtendGlobalProps<ComponentProps<typeof HistoryLauncherImpl>>
> = registerCustomElement("wrc-history-launcher", HistoryLauncherImpl);

export default HistoryLauncher;
