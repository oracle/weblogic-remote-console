/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { broadcastErrorMessage, broadcastMessageResponse } from "../notification-utils";

describe("notification-utils", () => {
  it("prefers backend response text when broadcasting an error", () => {
    const broadcastMessage = jest.fn();
    const ctx: any = { context: { broadcastMessage } };
    const error: any = new Error("Unexpected end of JSON input");
    error.name = "Request Failed";
    error.status = 500;
    error.body = "Backend exploded";

    broadcastErrorMessage(ctx, error);

    expect(broadcastMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
        summary: "HTTP 500",
        detail: "Backend exploded",
      })
    );
  });

  it("does not label malformed 2xx responses as HTTP success", () => {
    const broadcastMessage = jest.fn();
    const ctx: any = { context: { broadcastMessage } };
    const error: any = new Error("Unexpected non-JSON response from /api/test");
    error.name = "Request Failed";
    error.status = 200;
    error.body = "login page html";

    broadcastErrorMessage(ctx, error);

    expect(broadcastMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
        summary: "Request Failed",
        detail: "login page html",
      })
    );
  });

  it("escapes backend HTML in message response details before creating DOM nodes", () => {
    const broadcastMessage = jest.fn();
    const ctx: any = { context: { broadcastMessage } };

    broadcastMessageResponse(ctx, {
      messages: [
        {
          severity: "ERROR",
          detail: '<img src=x onerror="alert(1)"><b>bad</b>&"\'' ,
          property: ""
        }
      ]
    });

    expect(broadcastMessage).toHaveBeenCalledTimes(1);
    const firstCallArg = broadcastMessage.mock.calls[0][0];
    expect(firstCallArg.severity).toBe("error");
    expect(firstCallArg.html.string).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(firstCallArg.html.string).toContain("&lt;b&gt;bad&lt;/b&gt;&amp;&quot;&#39;");
    expect(firstCallArg.html.string).not.toContain("<img");
    expect(firstCallArg.html.string).not.toContain("<b>");
  });
});
