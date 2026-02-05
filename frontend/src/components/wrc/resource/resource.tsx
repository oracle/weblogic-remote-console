/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import "css!./wrc-form-styles.css";
import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType, createContext } from "preact";
import { useContext, useEffect, useMemo, useState, useRef } from "preact/hooks";
import { ErrorBoundary } from "wrc/error-boundary";
import { ResourceContext } from "../integration/resource-context";
import { DatabusContext } from "wrc/integration/DatabusContext";
import { broadcastErrorMessage } from "wrc/shared/controller/notification-utils";
import * as HtmlUtils from "ojs/ojhtmlutils";
import * as Translations from "ojs/ojtranslation";
import { Builder } from "../shared/controller/builder";
import { BuilderFactory } from "../shared/controller/builderfactory";
import { Global } from "../shared/global";
import type { Databus } from "wrc/integration/databus";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { Action } from "../shared/typedefs/pdj";
import { Message } from "wrc/shared/typedefs/common";
import { Action as ojAction } from "ojs/ojvcomponent";
export type ActionCompletedEvent = { action: Action; messages?: Message[] };
export type BeforeNavigateEvent = {
  path: string;
  preventDefault: () => void;
  defaultPrevented: boolean;
};

export type Context = {
  rdj: string;
  unique?: string;
  context?: ResourceContext;
  databus?: Databus;
  showHelp: boolean;
  onActionCompleted?: ojAction<ActionCompletedEvent>;
  onBeforeNavigate?: ojAction<BeforeNavigateEvent>;
};

export const UserContext = createContext<Context | null>(null);

type Props = Readonly<{
  rdj: string;
  pdj?: string;
  showHelp?: boolean;
  unique?: string;
  context?: ResourceContext;
  pageContext?: string
  backendPrefix?: string;
  onBeforeNavigate?: ojAction<BeforeNavigateEvent>;
  onActionCompleted?: ojAction<ActionCompletedEvent>;
}>;

/**
 * 
 * 
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * @ojmetadata main "wrc/resource"
 * @ojmetadata dependencies {
      "kebab-menu": "1.0.0"
    }
 */
function ResourceImpl({ rdj, pdj, unique, context, pageContext, showHelp = false, backendPrefix, onBeforeNavigate, onActionCompleted }: Props) {
  // Reflect unique into Global only when it changes
  useEffect(() => {
    if (unique && !Global.global.unique) {
      Global.global.unique = unique || "";
    }
  }, [unique]);

  useEffect(() => {
    if (backendPrefix) {
      Global.global.backendPrefix = backendPrefix;
    } 
  }, [backendPrefix, rdj]);

  const [isLoading, setIsLoading] = useState(true);
  const databusFromContext = useContext(DatabusContext);
  const databus = databusFromContext || undefined;
  const [builder, setBuilder] = useState<Builder>();
  const [showSpinner, setShowSpinner] = useState(false);

  // Update page title when builder/content changes
  useEffect(() => {
    const title = builder?.getPageTitle?.();
    if (title) {
      const appName = t["wrc-header"]?.text?.appName || "WebLogic Remote Console";
      document.title = `${appName} - ${title}`;
    }
  }, [builder]);
  const resolvedContext = context; // ?? window.wrcResourceContext;

  // Wrap routerController.navigateToAbsolutePath to emit a cancelable onBeforeNavigate event
  const effectiveContext = useMemo(() => {
    if (!resolvedContext) return resolvedContext;
    const rc: any = (resolvedContext as any).routerController;
    if (!rc || typeof rc.navigateToAbsolutePath !== "function") return resolvedContext;

    const originalNavigate = rc.navigateToAbsolutePath.bind(rc);

    const wrapped = {
      ...(resolvedContext as any),
      routerController: {
        ...rc,
        navigateToAbsolutePath: (...args: any[]) => {
          const path = args[0];
          const opts = args[1] as any;
          if (opts?.__skipBeforeNavigate === true) {
            return originalNavigate(...args);
          }
          let defaultPrevented = false;
          const ev = {
            path,
            preventDefault: () => {
              defaultPrevented = true;
            },
            get defaultPrevented() {
              return defaultPrevented;
            }
          } as BeforeNavigateEvent;

          try {
            onBeforeNavigate?.(ev);
          } catch (_e) {
            // swallow handler errors
          }

          if (defaultPrevented) return;
          return originalNavigate(...args);
        }
      }
    };

    return wrapped as ResourceContext;
  }, [resolvedContext, onBeforeNavigate]);
  //const resolvedDatabus: Databus | undefined = databus ?? Global.global.databus ?? undefined;

  // Only show the loading spinner for "long" loads (debounced ~1.5s)
  useEffect(() => {
    let timer: any;
    if (isLoading) {
      setShowSpinner(false);
      timer = setTimeout(() => setShowSpinner(true), 1500);
    } else {
      setShowSpinner(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, rdj]);

  const parentCtx = useContext(UserContext);
  //const effectiveRdj = rdj || parentCtx?.rdj || "";

  useEffect(() => {
    let cancelled = false;

    // Whenever the RDJ changes, enter loading state and clear prior content
    setIsLoading(true);
    setBuilder(undefined);

    if (!rdj) {
      return () => {
        cancelled = true;
      };
    }

    let startId = window.setTimeout(() => {
      new BuilderFactory(rdj, pdj, resolvedContext, pageContext)
        .build()
        .then((builder) => {
          if (cancelled) return;
          setBuilder(builder);
          setIsLoading(false);
        })
        .catch((err: any) => {
        if (cancelled) return;
        // Stop spinner
        setIsLoading(false);

        // Build a minimal ctx for messaging/navigation
        const ctx = { rdj, unique, context: resolvedContext, databus, showHelp };

        // Broadcast friendly info for 404; otherwise broadcast error
        try {
          const status = err?.status;
          const msg = err?.message || "";
          const isNotFound = status === 404;
          if (isNotFound && resolvedContext?.broadcastMessage) {
            const summary =
              t["wrc-recently-visited"]?.messages?.pageNoLongerExists?.summary;
            const d1 = Translations.applyParameters(
              t["wrc-recently-visited"]?.messages?.pageNoLongerExists?.detail1 ?? "",
              [rdj]
            );
            const d2 = Translations.applyParameters(
              t["wrc-recently-visited"]?.messages?.pageNoLongerExists?.detail2 ?? "",
              [rdj]
            );
            const html = `<div>${d1}<br/>${d2}</div>`;
            const untypedBroadcastMessageFunc = resolvedContext.broadcastMessage as any;
            untypedBroadcastMessageFunc({
              summary,
              html: { view: HtmlUtils.stringToNodeArray(html), string: html },
              severity: "info",
              autoTimeout: -1
            });
          } else {
            broadcastErrorMessage(
              ctx,
              err instanceof Error ? err : new Error(String(err))
            );
          }
        } catch (_e) {
          // no-op if broadcast infrastructure not present
        }

        // On 4xx, navigate to a safe path
        try {
          const safePath = "/api/-current-/group";
          const status = err?.status;
          const msg = err?.message || "";
          const shouldNavigate =
            (typeof status === "number" && status >= 400 && status < 500);
          if (shouldNavigate) {
            effectiveContext?.routerController?.navigateToAbsolutePath?.(safePath);
          }
        } catch (_e) {
          // swallow navigation errors
        }
      });
    }, 0);

    return () => {
      cancelled = true;
      if (startId) {
        clearTimeout(startId);
      }
    };
  }, [rdj/*, pdj, pageContext, resolvedContext*/]);

  if (isLoading) {
    if (!showSpinner) return null;
    return (
      <div class="wrc-resource-spinner" role="status" aria-live="polite" aria-busy="true">
        <span class="oj-ux-ico-refresher oj-text-color-disabled wrc-spinner-icon" aria-hidden="true"></span>
      </div>
    );
  }

  const content = useMemo(() => builder?.getHTML(), [builder]);
  const providerValue = useMemo(() => ({ rdj: rdj, unique, context: effectiveContext, databus, showHelp, onActionCompleted, onBeforeNavigate }), [rdj, unique, effectiveContext, databus, showHelp, onActionCompleted, onBeforeNavigate]);

  return (
    <UserContext.Provider value={providerValue}>
      <ErrorBoundary>{content}</ErrorBoundary>
    </UserContext.Provider>
  );
}

export const Resource: ComponentType<
  ExtendGlobalProps<ComponentProps<typeof ResourceImpl>>
> = registerCustomElement("wrc-resource", ResourceImpl);
