/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import "css!wrc/error-boundary/error-boundary-styles.css";
import { customElement, GlobalProps } from "ojs/ojvcomponent";
import { Component, ComponentChild, Context, ErrorInfo } from "preact";
import { UserContext, Context as wrcContext } from "wrc/resource/resource";
import * as Logger from "ojs/ojlogger";

/**
 *
 *
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * @ojmetadata main "wrc/error-boundary"
 */
@customElement("wrc-error-boundary")
export class ErrorBoundary extends Component<GlobalProps> {
  static contextType = UserContext;

  state = { error: null };

  componentDidCatch(error: any, _errorInfo: ErrorInfo) {
    try { Logger.error(error?.stack || error?.message || String(error)); } catch { Logger.error(String(error)); }
    this.setState({ error: error.message });

    const ctx = this.context as wrcContext;

    if (ctx.context && ctx.context.broadcastMessage) {
      ctx.context.broadcastMessage({
        severity: 'error',
        summary: error.name,
        detail: error.message
      });
    }
  }

  render(): ComponentChild {
    return this.props.children;
  }
}
