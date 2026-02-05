/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 *
 * Lightweight, decoupled refresh coordination via DOM CustomEvents.
 * Consumers can dispatch a single event to request refresh work in interested components,
 * without introducing new databus dependencies
 */

export const REFRESH_EVENT = "wrc:refresh";

export type RefreshScope = {
  content?: boolean;
  navtree?: boolean;
};

export type RefreshTarget = {
  resourceData?: string;
  root?: string;
};

export type RefreshDetail = {
  scope?: RefreshScope;
  target?: RefreshTarget;
};

/**
 * Emit a wrc:refresh CustomEvent immediately (no debounce).
 * - scope.content: refresh main content area (forms/tables)
 * - scope.navtree: refresh nav-tree
 * - target: optional hints for listeners
 */
export function emitRefresh(detail?: RefreshDetail): void {
  window.dispatchEvent(new CustomEvent(REFRESH_EVENT, { detail: detail ?? {} }));
}

/**
 * Subscribe to the global refresh event. Returns an unsubscribe function.
 */
export function subscribeToRefresh(callback: (detail: RefreshDetail) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail as RefreshDetail;
    callback(detail || {});
  };
  window.addEventListener(REFRESH_EVENT, handler as EventListener);
  return () => window.removeEventListener(REFRESH_EVENT, handler as EventListener);
}
