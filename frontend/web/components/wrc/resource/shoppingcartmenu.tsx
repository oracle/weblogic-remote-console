/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 *
 * VDOM implementation of Shopping Cart menu in the content-area header.
 * - Renders a ghost chromed oj-c-button with a shopping cart icon.
 * - Opens an oj-menu anchored to the launcher button.
 * - "commit" and "discard" actions are placeholders that console.log when clicked.
 */

import "oj-c/button";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { ojDialog } from "ojs/ojdialog";
import "ojs/ojmenu";
import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import { useContext, useEffect, useState, useRef } from "preact/hooks";
import { Dialog } from "wrc/display/dialog";
import { Resource, UserContext } from "wrc/resource/resource";
import { _post, getDataComponent } from "wrc/shared/model/transport";
import { emitRefresh } from "wrc/shared/refresh";
import Context = require("ojs/ojcontext");
import * as Logger from "ojs/ojlogger";

function ShoppingCartMenuImpl() {
  const ctx = useContext(UserContext);
  const dialogRef = useRef<ojDialog | null>(null);

  const VIEW = "view-changes";
  const DISCARD = "discard";
  const COMMIT = "commit";

  const [shoppingCartVisible, setShoppingCartVisible] = useState(false);
  const [shoppingCartFull, setShoppingCartFull] = useState(false);
  const [changeManagerRdj, setChangeManagerRdj] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const databus = ctx?.databus;
    if (!databus) return;

    const signal = databus.subscribe((event: any) => {
      const shoppingcart = event?.shoppingcart;
      setShoppingCartVisible(shoppingcart?.state !== "off");
      setShoppingCartFull(shoppingcart?.state === "full");
    });

    return () => (signal as any)?.detach?.();
  }, [ctx?.databus]);

  const openMenu = (event: any) => {
    // Anchor the OJ menu to the launcher button (same pattern as ProjectMenu)
    (document.getElementById("shoppingCartMenu") as any)?.open?.(event);
  };

  const onMenuAction = (event: any) => {
    const value = event?.detail?.selectedValue as string;
    switch (value) {
      case VIEW: {
        // Build absolute RDJ for the Change Manager "changingTable", preserving host/base
        let rdjUrl: string;
        rdjUrl = "/api/-current-/edit/changeManager/changingTable";
        setChangeManagerRdj(rdjUrl);

        requestAnimationFrame(() => {
          const dlg = dialogRef.current as ojDialog | null;
          if (!dlg) return;

          // Use string form for my/at; mirrors original working behavior
          // const centeredPos = { my: "center", at: "center", of: window };

          const centeredPos = { at: { horizontal: 'center', vertical: 'center' }, my: { horizontal: 'center', vertical: 'center' }, offset: { x: 0, y: 0 } };

          // Wait for JET BusyContext so the element is upgraded before setProperty/open
          const bc = (Context as any).getContext(dlg).getBusyContext();
          bc.whenReady().then(() => {
            (dlg as ojDialog).setProperty?.("position", centeredPos as any);
            dlg.open();
          });
        });
        break;
      }
      case DISCARD:
        Logger.info("[shoppingcart] discard changes clicked");
        _post("/api/-current-/edit/changeManager/discardChanges", "{}").then(
          () => {
            // dummy call to update cart status
            getDataComponent("/api/-current-/edit/changeManager");
            // Refresh content + nav-tree since values may have reverted
            emitRefresh({ scope: { content: true, navtree: true } });
          },
        );
        break;
      case COMMIT:
        Logger.info("[shoppingcart] commit changes clicked");
        _post("/api/-current-/edit/changeManager/commitChanges", "{}").then(
          () => {
            // dummy call to update cart status
            getDataComponent("/api/-current-/edit/changeManager/");
          },
        );
        break;
      default:
        Logger.warn("[shoppingcart] unknown action", value);
    }
  };

  const iconClass = shoppingCartFull
    ? "oj-ux-ico-cart-full"
    : "oj-ux-ico-cart-alt";
  const tooltip = t["wrc-content-area-header"].icons.shoppingcart.tooltip;

  return (
    <div class="wrc-shoppingcart-menu">
      <oj-c-button
        id="shoppingCartMenuLauncher"
        class="size-5"
        chroming="ghost"
        tooltip={tooltip}
        aria-label={tooltip}
        onojAction={openMenu}
      >
        <span slot="startIcon" class={iconClass} aria-hidden="true"></span>
      </oj-c-button>

      <oj-menu
        id="shoppingCartMenu"
        aria-labelledby="shoppingCartMenuLauncher"
        onojMenuAction={onMenuAction}
        openOptions={{
          launcher: "shoppingCartMenuLauncher",
          initialFocus: "firstItem",
        }}
      >
        <oj-option id={VIEW} value={VIEW} disabled={!shoppingCartVisible}>
          {t["wrc-content-area-header"].menu.shoppingcart.view.label}
        </oj-option>
        <oj-option id="divider"></oj-option>
        <oj-option id={DISCARD} value={DISCARD}>
          <span
            role="img"
            aria-hidden="true"
            id="discard-changes"
            class="oj-ux-ico-cart-abandon cfe-ux-ico-iconfont-24"
            title={t["wrc-content-area-header"].menu.shoppingcart.discard.label}
          ></span>
          <span>
            {t["wrc-content-area-header"].menu.shoppingcart.discard.label}
          </span>
        </oj-option>
        <oj-option id={COMMIT} value={COMMIT}>
          <span
            role="img"
            aria-hidden="true"
            id="commit-changes"
            class="oj-ux-ico-cart-add cfe-ux-ico-iconfont-24"
            title={t["wrc-content-area-header"].menu.shoppingcart.commit.label}
          ></span>
          <span>
            {t["wrc-content-area-header"].menu.shoppingcart.commit.label}
          </span>
        </oj-option>
      </oj-menu>

      <Dialog
        id="shoppingcart-dialog"
        title={t['wrc-ancillary-content']?.tabstrip?.tabs?.shoppingcart?.label }
        onojClose={(e) => {
          if (e?.target === dialogRef.current) {
            setChangeManagerRdj(undefined);
          }
        }}
        position={{ at: { horizontal: 'center', vertical: 'center' }, my: { horizontal: 'center', vertical: 'center' }, offset: { x: 0, y: 0 } }}
        ref={dialogRef}
      >
        <div slot="body" class="oj-bg-body">
          <Resource
            rdj={changeManagerRdj || ""}
            context={ctx?.context}
            onActionCompleted={(_detail) => {
              const dlg = dialogRef.current;
              
              try { (dlg)?.close?.(); } catch (_e) { /* ignore */ }
              setChangeManagerRdj(undefined);
              // dummy call to update cart status
              getDataComponent("/api/-current-/edit/changeManager");
              // Refresh content + nav-tree since values may have reverted
              emitRefresh({ scope: { content: true, navtree: true } });
            }}
          ></Resource>
        </div>
      </Dialog>
    </div>
  );
}

export const ShoppingCartMenu: ComponentType<
  ExtendGlobalProps<ComponentProps<typeof ShoppingCartMenuImpl>>
> = registerCustomElement("wrc-shoppingcart-menu", ShoppingCartMenuImpl);

export default ShoppingCartMenu;
