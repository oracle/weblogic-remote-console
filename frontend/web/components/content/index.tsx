/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Databus } from "wrc/integration/databus";
import { ResourceContext } from "wrc/integration/resource-context";
import { NavTree } from "wrc/nav-tree/nav-tree";
import { Resource } from "wrc/resource";
import { StatusData } from "wrc/shared/typedefs/rdj";
import { getBackendBase } from "wrc/shared/backend-url";
import signals = require("signals");
import "oj-c/drawer-layout";
import "ojs/ojmessages";
import Context = require("ojs/ojcontext");
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { ojMessage } from "ojs/ojmessage";
import { BrandingHeaderImpl } from "wrc/branding-area/header";
import { DatabusProvider } from "wrc/integration/DatabusContext";
import { setDatabus } from "wrc/integration/databus-accessor";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";

export function Content() {
  // Resolve base once and pass into the outermost Resource/NavTree.
  // Keep Resource’s internal handling unchanged; only how we get the string changes.
  const [backendPrefix, setBackendPrefix] = useState<string>("");
  const [rdjUrl, setRdjUrl] = useState("/api/-current-/group?context=main");

  const [uniqueId] = useState(String(Date.now()));
  const [messages, setMessages] = useState<Array<ojMessage.Message>>([]);
  
  const messageProvider = useMemo(() => new ArrayDataProvider<any, ojMessage.Message>(messages), messages);

  const resourceContext: ResourceContext = {
    applicationController: {
      resetDisplay: () => window.location.href = '/'
    },
    routerController: {
      // Resource will produce absolute paths like "/api/…"; keep rdj relative and let transport apply backendPrefix.
      navigateToAbsolutePath: (path: string) => setRdjUrl(path),
      selectRoot: (_root: string): void => { },
    },
    broadcastMessage: (message: ojMessage.Message) => {
      // Mirror legacy popupMessageSent handler: clear when falsy, else push with auto-timeout logic
      // Note: If message.autoTimeout === -1 the message will be sticky; otherwise default/clamp to 1500ms for info/confirmation
      if (!message) {
        setMessages([]);
        return {};
      }
      const m = { ...message };
     
      if (m.severity && (m.severity === "confirmation" || m.severity === "info")) {
        if (typeof m.autoTimeout === "undefined") {
          m.autoTimeout = 1500;
        }
        const value = parseInt(String(m.autoTimeout));
        if (isNaN(value) || m.autoTimeout < 1000 || m.autoTimeout > 60000) {
          m.autoTimeout = 1500;
        }
      }
      setMessages(prev => [...prev, m]);
      return {};
    },
  };

  const [thebus] = useState(new signals.Signal());
  const lastMessageRef = useRef<StatusData | undefined>(undefined);

  useEffect(() => {
    const binding = thebus.add((message: StatusData) => {
      lastMessageRef.current = message;
    });
    return () => {
      binding.detach();
    };
  }, [thebus]);

  // Resolve backend base once and cache it for Resource/NavTree.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const base = await getBackendBase();
        if (mounted) setBackendPrefix(base);
      } catch {
        // leave as empty; transport will fall back to window.location
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const databus: Databus = {
    subscribe: (callback) => {
      const binding = thebus.add(callback);

      const msg = lastMessageRef.current;
      if (msg) {
        callback(msg);
      }

      return binding;
    },
    get: () => {
      return thebus;
    },
  };

  // Make databus available to non-UI modules
  useEffect(() => { setDatabus(databus); }, [databus]);

  const messageRenderer = (message: any) => { 
  if (message?.data?.html?.string) {
    return (<oj-message message={message.data}>
      <div
        slot="detail"
        dangerouslySetInnerHTML={{ __html: message?.data?.html?.string || "" }}
      ></div>
    </oj-message>)
  } else {
    return (
      <oj-message message={message.data}></oj-message>
    )
  }
    
}

  // Auto-open the nav drawer after initial paint, once JET BusyContext is ready
  const autoOpenedRef = useRef(false);
  useEffect(() => {
    const drawer = document.getElementById('drawer-layout') as HTMLElement | null;
    if (!drawer) return;
    try {
      const bc = Context.getContext(drawer).getBusyContext();
      bc.whenReady().then(() => {
        requestAnimationFrame(() => {
          if (autoOpenedRef.current) return;
          autoOpenedRef.current = true;
          const btn = document.getElementById('navtree-toggler-link') as HTMLElement | null;
          if (btn) {
            // Reuse header toggle logic to adjust height and init resizer
            (btn as HTMLElement).click();
          } else {
            // Fallback: set property directly
            (drawer as any).startOpened = true;
          }
        });
      });
    } catch (_e) {
      // If BusyContext not available, still try to open on next frame
      requestAnimationFrame(() => {
        if (autoOpenedRef.current) return;
        autoOpenedRef.current = true;
        (drawer as any).startOpened = true;
      });
    }
  }, []);

  return (
    <DatabusProvider databus={databus}>
    <>
      <div id="globalBody" class="oj-bg-body">
        <header>
          <BrandingHeaderImpl context={resourceContext}></BrandingHeaderImpl>
        </header>
        <div class="horizontal-green-stripe h-2 oj-flex-item"></div>
        <div
          id="middle-container"
          class="oj-bg-body oj-flex oj-sm-flex-items-initial oj-sm-flex-wrap-nowrap"
          data-runtime-role="app"
        >
          <oj-c-drawer-layout
            id="drawer-layout"
            start-display="reflow"
          >
            <div id="navtree-container2" slot="start">
              <nav class="oj-flex-item" aria-label={t["wrc-content"]?.ariaLabel?.navigationPanel}>
                <div class="left_panel oj-bg-neutral-30">
                  <div>
                    <NavTree
                      unique={uniqueId}
                      context={resourceContext}
                      navtreeUrl="/api/project/navtree"
                      url=""
                      backendPrefix={backendPrefix}
                    />
                  </div>
                </div>
              </nav>
              <div
                id="drawer-start-resizer"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize navigation panel"
              ></div>
            </div>
            <main class="right_panel oj-bg-body">
              <div
                id="content-area-container"
                class="oj-bg-body oj-flex oj-sm-flex-direction-column oj-sm-flex-wrap-nowrap"
              >
                <div
                  id="content-area-body"
                  class="oj-bg-body oj-flex oj-sm-flex-items-initial oj-sm-flex-wrap-nowrap"
                >
                  <div
                    id="table-form-container"
                    class="oj-flex-item oj-bg-body"
                  >
                    <div class="oj-flex oj-sm-flex-direction-column wrc-resource-wrapper">
                      <Resource
                        rdj={rdjUrl}
                        context={resourceContext}
                        pageContext="main"
                        backendPrefix={backendPrefix}
                      ></Resource>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="ancillary-content-area-container"
                class="oj-bg-body oj-flex oj-sm-flex-items-initial oj-sm-justify-content-flex-end"
              >
                {/* ANCILLARY <oj-module config="[[ancillaryContentAreaModuleConfig]]"></oj-module> */}
              </div>
            </main>
          </oj-c-drawer-layout>
        </div>

        <footer class="oj-applayout-fixed-bottom oj-bg-neutral-170 oj-color-invert">
          <div id="footer-container" class="oj-flex-bar"></div>
        </footer>

        <div id="message-container">
          <oj-messages messages={messages} display="general" position={{}}>
            <template
              slot="messageTemplate"
              data-oj-as="message"
              render={messageRenderer}
            ></template>
          </oj-messages>
        </div>
      </div>
    </>
    </DatabusProvider>
  );

}
