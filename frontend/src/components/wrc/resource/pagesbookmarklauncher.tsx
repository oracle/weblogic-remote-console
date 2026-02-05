/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 *
 * VDOM implementation of the MVVM pages-bookmark-icon launcher.
 * - Renders a ghost chromed oj-c-button with a bookmark icon.
 * - On click, opens an oj-dialog that embeds a wrc-resource at /api/bookmarks.
 * - No menu is used (unlike project-menu) per requirements.
 * - Underlying DOM structure mirrors the MVVM version closely.
 */

import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import { useContext, useState, useRef } from "preact/hooks";

import "oj-c/button";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { Dialog } from "wrc/display/dialog";
import { BeforeNavigateEvent, Resource, UserContext } from "wrc/resource/resource";
import { ojDialog } from "ojs/ojdialog";
import { Action as ojAction } from "ojs/ojvcomponent";
import { getData } from "wrc/shared/model/transport";
import "oj-c/message-toast";
import MutableArrayDataProvider = require('ojs/ojmutablearraydataprovider');
import Context = require("ojs/ojcontext");

function PagesBookmarkLauncherImpl() {
  const ctx = useContext(UserContext);
  const dialogRef = useRef<ojDialog | null>(null);

  const [rdjUrl, setRdjUrl] = useState<string | null>(null);
  const [toastDP, setToastDP] = useState(new MutableArrayDataProvider([], { keyAttributes: 'key' }));

  // Keep same tooltip semantics as MVVM
  const tooltip = (t as any)?.["wrc-common"]?.tooltips?.pagesHistory?.star
    ?.value;

  const openDialog = () => {
    // Prefer /api/bookmarks which is what server BookmarksResource is wired for
    setRdjUrl("/api/bookmarks");

    requestAnimationFrame(() => {
      const dlg = dialogRef.current as ojDialog | null;
      if (!dlg) return;

      const bc = (Context as any).getContext(dlg).getBusyContext();
      bc.whenReady().then(() => {
        dlg.open();
      });
    });
  };

  const onClose = (e: ojDialog.ojClose) => {
    if (e?.target === dialogRef.current) {
      setRdjUrl(null);
    }
  };


  const beforeNavigateHandler: ojAction<BeforeNavigateEvent> = (evt) => {
    // Cancel navigation; verify path asynchronously, then navigate with skip flag on success.
    evt.preventDefault();
    const path = evt.path;

    getData(path, undefined)
      .then(() => {
        (ctx?.context?.routerController as any)?.navigateToAbsolutePath?.(path, { __skipBeforeNavigate: true });
      })
      .catch((_e) => {
        // Keep navigation cancelled; show a toast message that the page is not reachable
        const summary = t['wrc-common']?.labels?.error?.value || 'Error';
        const detail = t['wrc-common']?.labels?.pagesBookmark?.notreachable?.value || '';
        // FortifyIssueSuppression Key Management: Hardcoded Encryption Key
        const items = [{ key: 'page-not-reachable', severity: 'error', summary, detail }];
        try {
          const current = toastDP?.data?.slice?.() || [];
          toastDP.data = current.concat(items);
          setToastDP(toastDP);
        } catch (_ignored) {
          // Fallback if provider not initialized yet
          setToastDP(new MutableArrayDataProvider(items, { keyAttributes: 'key' }));
        }
      });
  }

  const closeMessage = (event: CustomEvent) => {
    if (toastDP) {
      let data = (toastDP.data.slice() as any[]);
      const closeMessageKey = (event as any).detail.key;

      data = data.filter((message: any) => message.key !== closeMessageKey);
      toastDP.data = data;
      setToastDP(toastDP);
    }
  };
  
  return (
    <div class="wrc-pages-bookmark-launcher">
      <oj-c-button
        id="pagesBookmarkIconbarIcon"
        class="size-5"
        chroming="ghost"
        tooltip={tooltip}
        aria-label={tooltip}
        onojAction={openDialog}
      >
        <span
          slot="startIcon"
          class="oj-ux-ico-bookmark-favorite"
          aria-hidden="true"
        ></span>
      </oj-c-button>

      {/* Dialog wrapper matches our common Dialog component; do NOT use a menu */}
      <Dialog
        id="provider-info-style-bookmark-dialog"
        position={{ my: {horizontal:'center', vertical:'top'}, at:{horizontal:"center", vertical:'top'} }}
        onojClose={onClose}
        ref={dialogRef}
      >
        <div slot="body" class="oj-bg-body">
          <Resource rdj={rdjUrl || ""} context={ctx?.context} onBeforeNavigate={beforeNavigateHandler}/>
        </div>
      </Dialog>

      <oj-c-message-toast data={toastDP} position="top" onojClose={closeMessage}></oj-c-message-toast>
    </div>
  );
}

export const PagesBookmarkLauncher: ComponentType<
  ExtendGlobalProps<ComponentProps<typeof PagesBookmarkLauncherImpl>>
> = registerCustomElement(
  "wrc-pages-bookmark-launcher",
  PagesBookmarkLauncherImpl,
);

export default PagesBookmarkLauncher;
