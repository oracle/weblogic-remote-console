/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import type { Context } from "../../resource/resource";
import { Message, Response, ResponseError } from "../typedefs/common";
import * as HtmlUtils from "ojs/ojhtmlutils";

const HTML_TAG_PATTERN = /<[^>]*>/g;

const escapeHtml = (value?: string) => {
  if (!value) return "";

  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

const getPlainText = (value?: string) => {
  if (!value) return "";

  // JET announces detail through its live region. Remove backend markup so it
  // is not announced, without assigning untrusted content to an HTML sink.
  // The separately rendered HTML is escaped in escapeHtml() above.
  return value.replace(HTML_TAG_PATTERN, "");
};

const broadcastMessages = (ctx: Context | null, messages?: Message[]) => {
  if (!messages?.length || !ctx?.context?.broadcastMessage) return;

  const overallSeverity =
    messages.find((message) => message.severity)?.severity || "info";

  // Work around backwards compatibility with the MVVM header content. ojMessage does
  // not contain an html property, so escape the server text before creating DOM nodes.
  const html =
    "<ul>" +
    messages.map(
      (message) => `<li>${escapeHtml(message.detail || message.message)}</li>`,
    ).join("") +
    "</ul>";
  const detail = messages
    .map((message) => getPlainText(message.detail || message.message).trim())
    .filter(Boolean)
    .map((message) => /[.!?]$/.test(message) ? message : `${message}.`)
    .join(" ");

  const untypedBroadcastMessageFunc = ctx.context.broadcastMessage as any;
  untypedBroadcastMessageFunc({
    html: {  string: html },
    severity: overallSeverity.toLowerCase(),
    detail,
  });
};

export const broadcastErrorMessage = (ctx: Context | null, err: Error) => {
  const typedError = err as ResponseError;
  if (typedError.messages?.length) {
    broadcastMessages(ctx, typedError.messages);
    return;
  }

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
  broadcastMessages(ctx, messageResponse?.messages);
};
