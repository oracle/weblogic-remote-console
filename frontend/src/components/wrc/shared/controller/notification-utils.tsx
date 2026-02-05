/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Context } from "wrc/resource/resource";
import { Response } from "../typedefs/common";
import * as HtmlUtils from "ojs/ojhtmlutils";

export const broadcastErrorMessage = (ctx: Context | null, err: Error) => {
  if (ctx?.context && ctx.context.broadcastMessage) {
    ctx.context.broadcastMessage({
      severity: "error",
      summary: err.name,
      detail: err.message,
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
        (message) => "<li>" + (message.detail || message.message) + "</li>",
      );
    ("</ul>");

    const untypedBroadcastMessageFunc = ctx.context?.broadcastMessage as any;
    untypedBroadcastMessageFunc({
      html: { view: HtmlUtils.stringToNodeArray(html), string: html },
      severity: overallSeverity.toLowerCase(),
    });
  }
};
