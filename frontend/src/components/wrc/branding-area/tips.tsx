/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 *
 * VDOM Tips dialog (converted from MVVM tips.js/tips.html).
 * - Reads tip data via TipsManager (same MVVM microservice).
 * - Renders a modeless oj-dialog with filter popup and tip cards.
 * - Listens for "wrc:headerAction" with detail.action === "tips" to open.
 */

import { h } from "preact";
import { useEffect, useMemo, useState, useRef } from "preact/hooks";
import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";


import "ojs/ojpopup";
import "ojs/ojcheckboxset";
import "ojs/ojoption";
import "ojs/ojlabel";
import "oj-c/button";
import t = require("ojL10n!wrc/shared/resources/nls/frontend");
import TipsManager from "./tips-manager";
import { ojCheckboxset } from "ojs/ojcheckboxset";
import "oj-c/checkboxset";
import { Dialog } from "wrc/display/dialog";
import { ojDialog } from "ojs/ojdialog";
import Context = require("ojs/ojcontext");
  
const openExternalUrl = (url: string) => {
  try {
    const electron = (window as any)?.electron_api;
    if (electron && electron.ipc && typeof electron.ipc.invoke === "function") {
      electron.ipc.invoke("external-url-opening", url);
      return;
    }
  } catch (_e) {
    // ignore and fallback
  }
  window.open(url, "_blank", "noopener,noreferrer");
};

type TipCard = {
  id: string;
  category: string;
  visible: boolean;
  tag: string;
  title: string;
  html: string;
};

function TipsImpl() {
  const dialogRef = useRef<ojDialog | null>(null);
  const i18n = useMemo(
    () => ({
      icons: {
        ancillary: {
          contentItem: {
            id: "tips",
            iconFile: "tips-icon-blk_24x24",
            tooltip:
              (t as any)["wrc-ancillary-content"]?.tabstrip?.tabs?.tips?.label ||
              "User Tips",
          },
        },
        close: {
          iconFile: "dialog-close-blk_24x24",
          tooltip:
            (t as any)["wrc-common"]?.buttons?.close?.label || "Close",
        },
        filter: {
          iconFile: "oj-ux-ico-filter",
          tooltip:
            (t as any)["wrc-common"]?.tooltips?.filter?.value || "Filter",
        },
      },
      popups: {
        tips: {
          title:
            (t as any)["wrc-ancillary-content"]?.popups?.tips?.title ||
            "Filter Tips",
          checkboxes: {
            hideall:
              (t as any)["wrc-ancillary-content"]?.popups?.tips?.checkboxes
                ?.hideall || "Hide All Tips",
            productivity:
              (t as any)["wrc-ancillary-content"]?.popups?.tips?.checkboxes
                ?.productivity || "Show Productivity Tips",
            personalization:
              (t as any)["wrc-ancillary-content"]?.popups?.tips?.checkboxes
                ?.personalization || "Show Personalization Tips",
            whereis:
              (t as any)["wrc-ancillary-content"]?.popups?.tips?.checkboxes
                ?.whereis || "Show Where Is... Tips",
            accessibility:
              (t as any)["wrc-ancillary-content"]?.popups?.tips?.checkboxes
                ?.accessibility || "Show Accessibility Tips",
            connectivity:
              (t as any)["wrc-ancillary-content"]?.popups?.tips?.checkboxes
                ?.connectivity || "Show Connectivity Tips",
            security:
              (t as any)["wrc-ancillary-content"]?.popups?.tips?.checkboxes
                ?.security || "Show Security Tips",
            other:
              (t as any)["wrc-ancillary-content"]?.popups?.tips?.checkboxes
                ?.other || "Show Other Tips",
          },
        },
      },
      titles: {
        ancillary: {
          contentItem: {
            value:
              (t as any)["wrc-ancillary-content"]?.tabstrip?.tabs?.tips
                ?.label || "User Tips",
          },
        },
      },
    }),
    []
  );


  const [allCategories, setAllCategories] = useState<
    { id: string; label: string; option: string }[]
  >([]);
  const [includedCategories, setIncludedCategories] = useState<string[]>([]);
  const [cards, setCards] = useState<TipCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<TipCard[]>([]);

    
  // Load tips + categories once
  useEffect(() => {
    const docsURL = "";
    const visible = TipsManager.getAllVisible() || [];
    const enriched: TipCard[] = visible.map((tip: any) => {
      const tag =
        (t as any)["wrc-ancillary-content"]?.tips?.labels?.[tip.category]
          ?.value || tip.category;
      const title =
        (t as any)["wrc-ancillary-content"]?.tips?.cards?.[tip.id]?.title ||
        tip.id;
      let html =
        (t as any)["wrc-ancillary-content"]?.tips?.cards?.[tip.id]
          ?.descriptionHTML || "";
      // Replace docs placeholder and strip MVVM "on-click" bindings
      html = String(html)
        .replaceAll("@@docsURL@@", docsURL)
        .replace(/on-click="[^"]*"/g, "");
      return {
        id: tip.id,
        category: tip.category,
        visible: !!tip.visible,
        tag,
        title,
        html,
      };
    });
    setCards(enriched);

    const cats =
      ((TipsManager.getAllCategories() || []) as any[]).map((cat: any) => ({
        id: cat.id,
        label:
          (t as any)["wrc-ancillary-content"]?.tips?.labels?.[cat.id]?.value ||
          cat.id,
        option:
          (t as any)["wrc-ancillary-content"]?.popups?.tips?.checkboxes?.[
            cat.id
          ] || cat.id,
      })) || [];
    setAllCategories(cats);

    let defaults = TipsManager.getCategories() || [];
    // If no defaults are provided by the service, select all categories by default
    if (!defaults || defaults.length === 0) {
      defaults = cats.map((c) => c.id);
    }
    
    setIncludedCategories(defaults);
    setFilteredCards(enriched.filter((c) => defaults.includes(c.category)));
  }, []);

  // Refilter when includedCategories/cards change
  useEffect(() => {
    if (includedCategories.length === 0) setFilteredCards([]);
    else setFilteredCards(cards.filter((c) => includedCategories.includes(c.category)));
  }, [includedCategories, cards]);

  // Open dialog when header's tips button is clicked
  useEffect(() => {
    const onHeaderAction = (evt: Event) => {
      const action = (evt as CustomEvent).detail?.action;
      if (action === "tips") {
        requestAnimationFrame(() => {
          const dlg = dialogRef.current as ojDialog | null;
          if (!dlg) return;
          const bc = (Context as any).getContext(dlg).getBusyContext();
          bc.whenReady().then(() => dlg.open());
        });
      }
    };
    window.addEventListener("wrc:headerAction", onHeaderAction as EventListener);
    return () =>
      window.removeEventListener("wrc:headerAction", onHeaderAction as EventListener);
  }, []);

  const closeDialog = () => {
    try { dialogRef.current?.close?.(); } catch { /* ignore */ }
  };

  // Keep dialog resizable handles like MVVM: remove all but W/SW/S on focus
  const onDialogFocus = (e: any) => {
    const id = e?.currentTarget?.id;
    if (!id) return;
    const nodeList = document.querySelectorAll(
      `#${id} .oj-resizable-handle`
    ) as NodeListOf<HTMLElement>;
    for (let i = nodeList.length - 1; i >= 0; i--) {
      const classList = nodeList[i].className.split(" ").filter(Boolean);
      const last = classList[classList.length - 1];
      if (!["oj-resizable-w", "oj-resizable-sw", "oj-resizable-s"].includes(last)) {
        nodeList[i].remove();
      }
    }
  };

  const launchTipsFilterPopup = () => {
    const popup = document.getElementById("tipsFilterPopup") as any;
    if (popup?.isOpen?.()) popup.close();
    popup?.open?.();
  };

  const onCheckboxValueChanged = (
    event: ojCheckboxset.valueChanged<string, string>,
  ) => {
    const value: string[] = event?.detail?.value || [];

    setIncludedCategories(value);
  };

  const onCardContentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    // Bubble up to find element with data-url
    let el: HTMLElement | null = target;
    while (el && el !== (e.currentTarget as HTMLElement)) {
      const dataUrl = el.getAttribute("data-url");
      if (dataUrl) {
        const url = dataUrl.replace(
          "@@docsURL@@",
           ""
        );
        try {
          openExternalUrl(url);
        } catch {
          window.open(url, "_blank", "noopener,noreferrer");
        }
        e.preventDefault();
        return;
      }
      el = el.parentElement;
    }
  };

  return (
    <>
      <Dialog
        id="tips-dialog"
        position={{ my: {horizontal:'center', vertical:'top'}, at:{horizontal:"center", vertical:'top'} }}
        
        resizeBehavior="resizable"
        dragAffordance="title-bar"
        onojFocus={onDialogFocus}
        aria-labelledby="tips-dialog-title"
        ref={dialogRef}
      >
        <div slot="body" class="oj-bg-body" style={{ overflow: 'auto' }}>
          <div class="oj-flex-bar oj-bg-body">
            <div class="oj-flex-bar-start">
              <span class="oj-ux-ico-lightbulb size-7 oj-sm-align-self-center" aria-hidden="true"></span>
              <oj-label id="tips-dialog-title" class="oj-sm-align-self-center">
                {i18n.titles.ancillary.contentItem.value}
              </oj-label>
            </div>
          </div>
          <div class="oj-flex-bar oj-bg-body">
            <div class="oj-flex-bar-start oj-sm-flex-items-initial">
              <oj-c-button chroming='borderless' onojAction={launchTipsFilterPopup} tooltip="Filter Tips" label={i18n.icons.filter.tooltip}
                aria-labelledby="filter-label" class='oj-sm-align-items-center' size="sm">
                <span
                  id="tips-filter-icon"
                  class={i18n.icons.filter.iconFile + ' oj-sm-align-self-center size-3'}
                  slot='startIcon'
                ></span>
              </oj-c-button>
            </div>
          </div>
          <div
            id="tips-tab-cards-container"
            role="region"
            aria-label={i18n.icons.ancillary.contentItem.tooltip}
            class="oj-web-applayout-max-width oj-sm-web-padding-horizontal oj-bg-body"
            tabindex={0}
            style={{ overflow: 'visible' }}
          >
            <div class="oj-flex oj-sm-flex-items-initial">
              {filteredCards.map((card) => (
                <div
                  class={
                    "tips-panel-card-padding oj-flex oj-flex-item oj-sm-flex-items-1 " +
                    (filteredCards.length > 1
                      ? "oj-sm-12 oj-md-4 oj-lg-3"
                      : "oj-sm-9")
                  }
                >
                  <div class="tips-panel-card" tabindex={0}>
                    <span class="tips-card-tag">{card.tag}</span>
                    <span class="cfe-screen-reader-period"></span>
                    <div class="tips-card-title">{card.title}</div>
                    <span class="cfe-screen-reader-period"></span>
                    <div
                      class="tips-card-content"
                      onClick={onCardContentClick}
                      dangerouslySetInnerHTML={{ __html: card.html }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>

      <oj-popup id="tipsFilterPopup" initial-focus="firstFocusable">
        <oj-c-checkboxset
          label-hint={i18n.popups.tips.title}
          label-edge="inside"
          options={allCategories.map(c => { return { value: c.id, ...c } })}
          value={includedCategories}
          onvalueChanged={onCheckboxValueChanged as any}
        >
        </oj-c-checkboxset>
      </oj-popup>
    </>
  );
}

export const Tips: any = registerCustomElement("wrc-tips", TipsImpl);
export default Tips;
