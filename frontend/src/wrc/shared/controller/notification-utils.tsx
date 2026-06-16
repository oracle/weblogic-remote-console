/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import type { Context } from "../../resource/resource";
import { Response } from "../typedefs/common";
import * as HtmlUtils from "ojs/ojhtmlutils";

const escapeHtml = (value?: string) => {
  if (!value) return "";

  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

export const broadcastErrorMessage = (ctx: Context | null, err: Error) => {
  const typedError = err as Error & { body?: string; status?: number };
  const detail = typedError.body || err.message;
  const summary =
    typedError.status != null && typedError.status >= 400
      ? `HTTP ${typedError.status}`
      : err.name === "SyntaxError"
        ? "Request Failed"
        : err.name;

  if (ctx?.context && ctx.context.broadcastMessage) {
    ctx.context.broadcastMessage({
      severity: "error",
      summary,
      detail,
    });
  }
};

export const broadcastMessageResponse = (
  ctx: Context | null,
  messageResponse: Response,
) => {
  // broadcast messages to UI, this logic needs to be moved
  if (messageResponse?.messages && ctx?.context && ctx.context.broadcastMessage) {
    const overallSeverity =
      messageResponse.messages.find((message) => message.severity)?.severity ||
      "info";

    // workaround for backwards compatiblity with the mvvm header-content..
    // ojMessage does not contain an html property (which the frontend was using as an
    // undocumented feature) and there is no other way to pass html content...
    const html =
      "<ul>" +
      messageResponse.messages.map(
        (message) => `<li>${escapeHtml(message.detail || message.message)}</li>`,
      ).join("") +
      "</ul>";

    const untypedBroadcastMessageFunc = ctx.context?.broadcastMessage as any;
    untypedBroadcastMessageFunc({
      html: { view: HtmlUtils.stringToNodeArray(html), string: html },
      severity: overallSeverity.toLowerCase(),
    });
  }
};
