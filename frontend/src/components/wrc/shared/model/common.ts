/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Action, PDJ, Polling } from "../typedefs/pdj";
import { PropertyValueHolder, RDJ, Reference } from "../typedefs/rdj";
import { doAction, doActionInput } from "./transport";

export class Model {
  rdjUrl!: string;
  pdjUrl!: string | undefined;

  baseUrl: string | undefined;

  rdj: RDJ;
  pdj: PDJ;

  constructor(rdj: RDJ, pdj: PDJ) {
    this.rdj = rdj;
    this.pdj = pdj;
  }

  // -- common functionality related to Actions
  getActions() {
    return this.pdj?.sliceForm?.actions;
  }

  invokeAction(action: Action, references?: Reference[] | string[]) {
    const url =
      this.rdj?.actions?.[action.name]?.invoker?.resourceData ||
      this.rdj?.actions?.[action.name]?.inputForm?.resourceData ||
      this.rdjUrl;

    return doAction(url, action, references);
  }

  invokeActionInputAction(
changes: Record<string, PropertyValueHolder>, rows?: PropertyValueHolder, files?: Record<string, File>  ): Promise<Response> {
    if (!this.rdj?.invoker) {
      throw new Error("No invoker defined for ActionInputForm");
    }
    
    return doActionInput(
      this.rdj?.invoker?.resourceData || '',
      changes,
      rows,
      files
    );
  }

  getActionFormInput(action: Action) {
    return this.rdj?.actions?.[action.name]?.inputForm?.resourceData;
  }

  // Breadcrumbs and Cross-links accessors (hide RDJ structure from views)
  getBreadcrumbs(): Reference[] {
    const crumbs: Reference[] = [];
    if (Array.isArray(this.rdj?.breadCrumbs)) crumbs.push(...this.rdj.breadCrumbs);
    if (this.rdj?.self) crumbs.push(this.rdj.self);
    return crumbs;
  }

  getLinks(): Reference[] {
    return (this.rdj?.links || []) as Reference[];
  }

  // Capabilities
  canSaveToCart = true;
  canSaveNow = false;
  canDownload = false;
  canSupportTokens = false;

  // Polling state shared by all models
  pollingDisabled = false;
  pollingRunning = false;

  // Polling refresh() method that extending models override!
  async refresh() {}

  isPolling() {
    return this.pollingRunning;
  }

  startPolling(pollingState: Polling, callback: Function) {
    let attempts = 0;

    const timerFunc = () => {
      if (this.pollingDisabled) return;
      this.refresh().then(() => {
        attempts++;

        if (attempts < pollingState.maxAttempts) {
          window.setTimeout(timerFunc, pollingState.reloadSeconds * 1000);
        } else {
          this.pollingRunning = false;
        }

        callback();
      });
    };

    this.pollingRunning = true;
    this.pollingDisabled = false;
    window.setTimeout(timerFunc, pollingState.reloadSeconds * 1000);
  }

  stopPolling() {
    this.pollingRunning = false;
    this.pollingDisabled = true;
  }

  // Generic accessor for page title; UI should not reach into PDJ directly
  getPageTitle(): string | undefined {
    return this.pdj?.helpPageTitle || this.rdj?.self?.label;
  }
}
