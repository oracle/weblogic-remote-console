/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 *
 * Branding Header (VDOM) wrapper used by MVVM host.
 * Renders the header container and inserts VDOM custom elements (e.g., simple search).
 *
 * Intended to be embedded inside the legacy MVVM header.html as <wrc-branding-header>.
 */

import { h } from "preact";
import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import "ojs/ojinputsearch";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import SimpleSearch from "./simple-search";
import "oj-c/button";
import Tips from "./tips";
import { ResourceContext } from "wrc/integration/resource-context";

import { getDataComponent } from "wrc/shared/model/transport";
import { Response } from "wrc/shared/typedefs/common";
import { useEffect, useState } from "preact/hooks";
import { ojDialog } from "ojs/ojdialog";
import { requireAsset } from "wrc/shared/url";
import MessageLine from "./message-line";
import * as Logger from "ojs/ojlogger";


type Props = {
  context?: ResourceContext;
}

/**
 * @ojmetadata displayName "Branding Header"
 * @ojmetadata description "Top header shell for the application header region."
 * @ojmetadata main "wrc/branding-area"
 */
export function BrandingHeaderImpl({context}: Props) {
  const ariaLabel =
    t["wrc-header"]?.region?.ariaLabel?.value;

  const appName =
    t["wrc-header"]?.text?.appName;

  const version = '3.0.1';

  // Dark mode state + helpers
  const [darkEnabled, setDarkEnabled] = useState(false);
  const darkModeLabel = t["wrc"].prefs.darkmode;
  const DARK_MODE_KEY = 'wrc:darkMode';
  const darkClasses = ['oj-bg-neutral-170', 'oj-color-invert', 'oj-c-colorscheme-dependent'];

  const getRootEl = () =>
    (document.getElementById('globalBody') ||
     document.getElementById('appContainer') ||
     document.body) as HTMLElement;

  const applyDarkMode = (enabled: boolean) => {
    const root = getRootEl();
    if (!root) return;
    if (enabled) {
      darkClasses.forEach(c => root.classList.add(c));
    } else {
      darkClasses.forEach(c => root.classList.remove(c));
    }
  };

  // Initialize from persisted state or current DOM classes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DARK_MODE_KEY);
      if (stored === 'on' || stored === 'off') {
        setDarkEnabled(stored === 'on');
      } else {
        const root = getRootEl();
        setDarkEnabled(root?.classList?.contains('oj-color-invert') || false);
      }
    } catch {
      const root = getRootEl();
      setDarkEnabled(root?.classList?.contains('oj-color-invert') || false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply classes + persist + broadcast on change
  useEffect(() => {
    applyDarkMode(darkEnabled);
    try {
      localStorage.setItem(DARK_MODE_KEY, darkEnabled ? 'on' : 'off');
    } catch {
      // ignore
    }
    // Broadcast for any listeners (e.g., other components)
    window.dispatchEvent(new CustomEvent('wrc:darkMode', { detail: { enabled: darkEnabled } }));
  }, [darkEnabled]);

  const toggleDarkMode = () => setDarkEnabled(prev => !prev);

  //"wrc/config/console-frontend-jet.yaml"
  // loadYamlFile(requireAsset("wrc/config/console-frontend-jet.yaml")).then(data => { 
  //   console.log(data);
  // });


  // Navtree toggler + resizer (ported from MVVM)
  const navtreeToggleClick = () => {
    try {
      adjustDrawerLayoutHeight();
      const drawer = document.getElementById('drawer-layout') as any;
      if (!drawer) return;
      const current = !!drawer.startOpened;
      drawer.startOpened = !current;
      if (drawer.startOpened) {
        requestAnimationFrame(() => {
          getStoredWidth().then((w) => initDrawerResizer(w));
        });
      }
    } catch (_e) {
      // ignore
    }
  };

  const adjustDrawerLayoutHeight = () => {
    const header = document.querySelector('header') as HTMLElement | null;
    const drawer = document.getElementById('drawer-layout') as HTMLElement | null;
    const nav = document.getElementById('navtree-container2') as HTMLElement | null;
    const rightPanel = document.querySelector('#drawer-layout > main.right_panel') as HTMLElement | null;

    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const height = Math.max(0, Math.floor(vh - headerH));

    if (drawer) drawer.style.height = `${height}px`;
    if (nav) nav.style.height = `${height}px`;
    if (rightPanel) {
      rightPanel.style.minHeight = `${height}px`;
      rightPanel.style.height = `${height}px`;
    }
  };

  const getStoredWidth = async (): Promise<number | string | undefined> => {
    try {
      const electron = (window as any)?.electron_api;
      if (electron && electron.ipc && typeof electron.ipc.invoke === "function") {
        return await electron.ipc.invoke("get-property", "resizer_width");
      }
    } catch (_e) {
      // ignore
    }
    return undefined;
  };

  const initDrawerResizer = (storedWidth?: number | string) => {
    const pane = document.getElementById('navtree-container2') as HTMLElement | null;
    const drawerLayout = document.getElementById('drawer-layout') as HTMLElement | null;
    const resizer = document.getElementById('drawer-start-resizer') as HTMLElement | null;
    const startWrapper = document.querySelector('.oj-drawer-layout-surrogate .oj-drawer-start') as HTMLElement | null;
    if (!pane || !drawerLayout) return;

    const DRAWER_MIN_WIDTH = 220;
    const DRAWER_MAX_WIDTH = window.innerWidth - 20;
    const DRAWER_WIDTH_KEY = 'wrc.drawer.start.width';
    const EDGE_PX = 16;

    const DRAWER_DEFAULT = Math.round(window.innerWidth / 4);

    // Restore saved width
    if (!storedWidth) {
      storedWidth = localStorage.getItem(DRAWER_WIDTH_KEY) || DRAWER_DEFAULT;
    }

    const saved = parseInt(String(storedWidth));

    if (!isNaN(saved)) {
      const w = Math.max(DRAWER_MIN_WIDTH, Math.min(DRAWER_MAX_WIDTH, saved));
      pane.style.width = `${w}px`;
      document.documentElement.style.setProperty('--wrc-start-width', `${w}px`);
      if (startWrapper) {
        startWrapper.style.width = `${w}px`;
        startWrapper.style.flex = `0 0 ${w}px`;
      }
    }

    let dragging = false;
    let downX = 0;
    let baseWidth = 0;

    const setWidth = (w: number) => {
      const clamped = Math.max(DRAWER_MIN_WIDTH, Math.min(DRAWER_MAX_WIDTH, Math.floor(w)));
      pane.style.width = `${clamped}px`;
      document.documentElement.style.setProperty('--wrc-start-width', `${clamped}px`);
      if (startWrapper) {
        startWrapper.style.width = `${clamped}px`;
        startWrapper.style.flex = `0 0 ${clamped}px`;
      }
    };

    const nearRightEdge = (clientX: number) => {
      const rect = pane.getBoundingClientRect();
      // If explicit resizer exists, use its hitbox; otherwise an EDGE_PX hit area
      if (resizer) {
        const rr = resizer.getBoundingClientRect();
        return clientX >= rr.left && clientX <= rr.right;
      }
      return clientX >= rect.left && (rect.right - clientX) <= EDGE_PX;
    };

    const onMouseMovePane = (e: MouseEvent) => {
      if (dragging) return;
      pane.style.cursor = nearRightEdge(e.clientX) ? 'col-resize' : '';
    };

    const dragMove = (clientX: number) => {
      const dx = clientX - downX;
      setWidth(baseWidth + dx);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!nearRightEdge(e.clientX)) return;
      const rect = pane.getBoundingClientRect();
      dragging = true;
      downX = e.clientX;
      baseWidth = rect.width;
      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', onMouseMoveDoc);
      document.addEventListener('mouseup', onMouseUpDoc);
      e.preventDefault();
    };

    const onMouseMoveDoc = (e: MouseEvent) => {
      if (!dragging) return;
      dragMove(e.clientX);
    };

    const onMouseUpDoc = () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMouseMoveDoc);
      document.removeEventListener('mouseup', onMouseUpDoc);
      const width = Math.floor(pane.getBoundingClientRect().width);
      try {
        const electron = (window as any)?.electron_api;
        if (electron && electron.ipc && typeof electron.ipc.invoke === "function") {
          electron.ipc.invoke("set-property", { resizer_width: String(width) });
        } else {
          localStorage.setItem(DRAWER_WIDTH_KEY, String(width));
        }
      } catch (_ignored) {
        // no-op
      }
    };

    // Mouse listeners on pane to get edge-hover and start drag
    pane.addEventListener('mousemove', onMouseMovePane, { capture: true } as any);
    pane.addEventListener('mousedown', onMouseDown, { capture: true } as any);
    // Also bind directly on the explicit resizer if present for reliable hit testing
    if (resizer) {
      resizer.style.cursor = 'col-resize';
      resizer.style.touchAction = 'none';
      resizer.addEventListener('mousemove', onMouseMovePane, { capture: true } as any);
      resizer.addEventListener('mousedown', onMouseDown, { capture: true } as any);
    }

    // Touch support
    pane.addEventListener('touchstart', (e: TouchEvent) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      if (!nearRightEdge(t.clientX)) return;
      const rect = pane.getBoundingClientRect();
      dragging = true;
      downX = t.clientX;
      baseWidth = rect.width;
      document.body.style.cursor = 'col-resize';
      e.preventDefault();
    }, { passive: false, capture: true } as any);

    document.addEventListener('touchmove', (e: TouchEvent) => {
      if (!dragging) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      dragMove(t.clientX);
    }, { passive: false } as any);

    document.addEventListener('touchend', onMouseUpDoc);
  };

  const tooltips = {
    whatsNew: t["wrc-header"]?.icons?.whatsNew?.tooltip,
    tips: t["wrc-header"]?.icons?.tips?.tooltip,
    help: t["wrc-header"]?.icons?.help?.tooltip,
    logout: t["wrc-header"]?.buttons?.hosted?.logout?.label,
    navtreeToggler: t["wrc-header"]?.icons?.navtree?.toggler?.tooltip
  };
  
  const dispatchHeaderAction = (action: "whatsNew" | "tips" | "help" | "logout") => {


    let externalUrl;

    switch (action) {
      case "whatsNew":
        externalUrl = 'https://github.com/oracle/weblogic-remote-console/releases';
        break;
      case "tips":
        (document.getElementById("tips-dialog") as ojDialog)?.open();
        break;
      case "help":
        externalUrl = 'https://oracle.github.io/weblogic-remote-console/';
        break;
    }

    if (externalUrl) openExternalUrl(externalUrl);
  };

  const logoutClickHandler = () => {
    getDataComponent("/api/logout").then((response: Response) => {
      const redirectUrl = undefined; // what is this:  resp?.body?.data?.url; ?
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.reload();
      }
    });
  };

  /*
DataProviderManager.getCapabilities().then(caps => {
          const logoutEnabled = caps && caps.indexOf('Logout') != -1;

          this.i18n.buttons.hosted.logout.visible(logoutEnabled);
        });
  */

  const [logoutEnabled, setLogoutEnabled]= useState(false);

  getDataComponent("/api/about").then((response) => {
    Logger.info(response);

    const caps: string[] = response?.about?.capabilities;

    if (caps) {
      const enabled = typeof caps.find((c) => c === "Logout") !== "undefined";
      setLogoutEnabled(enabled);
    }
  });

  const resetApp = () => context?.applicationController?.resetDisplay()

  return (
    <>
      <div
        class="oj-bg-neutral-170 oj-color-invert oj-flex oj-sm-align-items-center"
        id="header-container"
        role="region"
        aria-label={ariaLabel}
      >
        <div
          class="oj-flex-bar oj-sm-align-items-center oj-sm-flex-wrap-nowrap"
          style={{ height: "100%" }}
        >
          <div class="oj-flex-bar-start oj-sm-align-items-center oj-sm-flex-1">
            <oj-c-button
              chroming="ghost"
              id="navtree-toggler-link"
              aria-label={tooltips.navtreeToggler}
              onojAction={navtreeToggleClick}
            >
              <span
                slot="startIcon"
                class="oj-ux-ico-menu"
                aria-hidden="true"
              ></span>
            </oj-c-button>
            <span
              class="branding-area-title-md oj-flex oj-sm-align-items-center oj-sm-align-self-center oj-sm-flex-1 oj-text-nowrap"
              title={appName}
              style={{ whiteSpace: "nowrap", minWidth: "0" }}
            >
              <a href="#" id="resetAppLink" onClick={resetApp} aria-labelledby='brand'>
                <img
                  class="branding-icon"
                  alt=""
                  aria-hidden="true"
                  src={requireAsset("wrc/assets/images/wrc-app-icon-color_88x78.png")}
                />
              </a>
              <span
                id='brand'
                class="oj-sm-align-self-center oj-sm-flex-1"
                aria-hidden="true"
                style={{ overflow: "hidden", textOverflow: "ellipsis", minWidth: "0" }}
              >{`${appName} ${version}`}</span>
            </span>
          </div>

          <div class="oj-flex-bar-start oj-sm-only-hide oj-md-only-hide oj-lg-1"> </div>
          <div
            id="header-simple-search"
            class="oj-flex-bar-middle oj-sm-only-hide oj-md-only-hide oj-lg-flex-1 oj-sm-align-items-center oj-md-margin-6x-start oj-md-margin-6x-end"
          >
            <SimpleSearch context={context}></SimpleSearch>
          </div>

          <div
            id="branding-area-header-iconbar"
            class="oj-flex-bar-end oj-sm-only-hide oj-sm-align-items-center oj-sm-flex-initial oj-sm-margin-6x-start"
          >
            {logoutEnabled ? (
              <oj-c-button
                onojAction={logoutClickHandler}
                label={t["wrc-header"].buttons.logout.label}
              >
                <span slot="startIcon" aria-hidden="true"></span>
              </oj-c-button>
            ) : (
              <></>
            )}

            <oj-c-button
              chroming="borderless"
              id="whatsNew"
              title={tooltips.whatsNew}
              aria-label={tooltips.whatsNew}
              onojAction={() => dispatchHeaderAction("whatsNew")}
            >
              <span
                slot="startIcon"
                class="oj-ux-ico-github"
                aria-hidden="true"
              ></span>
            </oj-c-button>
            <oj-c-button
              chroming="borderless"
              id="tips"
              title={tooltips.tips}
              aria-label={tooltips.tips}
              onojAction={() => dispatchHeaderAction("tips")}
            >
              <span
                slot="startIcon"
                class="oj-ux-ico-lightbulb"
                aria-hidden="true"
              ></span>
            </oj-c-button>
            <oj-c-button
              chroming="borderless"
              id="darkMode"
              title={darkModeLabel}
              aria-label={darkModeLabel}
              onojAction={toggleDarkMode}
            >
              <span
                slot="startIcon"
                class={
                  darkEnabled
                    ? "oj-ux-ico-weather-moon"
                    : "oj-ux-ico-weather-sun"
                }
                aria-hidden="true"
              ></span>
            </oj-c-button>
            <oj-c-button
              chroming="borderless"
              id="help"
              title={tooltips.help}
              aria-label={tooltips.help}
              onojAction={() => dispatchHeaderAction("help")}
            >
              <span
                slot="startIcon"
                class="oj-ux-ico-help-circle-s"
                aria-hidden="true"
              ></span>
            </oj-c-button>
          </div>
        </div>
      </div>
      <Tips></Tips>
      <MessageLine context={context} />
    </>
  );
}

 export const openExternalUrl = (url: string) => {
   const electron = (window as any)?.electron_api;

   if (electron && electron.ipc && typeof electron.ipc.invoke === "function") {
     electron.ipc.invoke("external-url-opening", url);
   } else {
     window.open(url, "_blank", "noopener noreferrer");
   }
 };


export const BrandingArea: any = registerCustomElement(
  "wrc-branding-area",
  BrandingHeaderImpl
);

export const BrandingHeader: any = registerCustomElement(
  "wrc-branding-header",
  BrandingHeaderImpl
);

export default BrandingHeader;
