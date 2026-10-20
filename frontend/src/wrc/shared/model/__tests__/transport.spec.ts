/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Global } from "../../global";
import {
  doAction,
  downloadResource,
  getDataComponent,
  parseResponseJson,
  saveBlobToFile,
} from "../transport";
import * as backendUrl from "../../backend-url";
import { setDatabus } from "../../../integration/databus-accessor";
import * as Logger from "ojs/ojlogger";

describe("transport downloads", () => {
  const originalBackendPrefix = Global.global.backendPrefix;
  const originalUnique = Global.global.unique;
  const originalLocation =
    window.location.pathname + window.location.search + window.location.hash;
  const originalCreateObjectUrl = URL.createObjectURL;
  const originalRevokeObjectUrl = URL.revokeObjectURL;
  const originalFetch = global.fetch;

  beforeEach(() => {
    Global.global.unique = "abc123";
  });

  afterEach(() => {
    Global.global.backendPrefix = originalBackendPrefix;
    Global.global.unique = originalUnique;
    window.history.replaceState({}, "", originalLocation);
    URL.createObjectURL = originalCreateObjectUrl;
    URL.revokeObjectURL = originalRevokeObjectUrl;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("should proxy backend downloads through fetch with credentials and preserve filename", async () => {
    const originalCreateElement = document.createElement.bind(document);
    const click = jest.fn();
    jest.spyOn(document, "createElement").mockImplementation(((tagName: string) => {
      if (tagName === "a") {
        return {
          click,
          download: "",
          href: "",
        } as any;
      }
      return originalCreateElement(tagName);
    }) as any);

    const blob = new Blob(["log-data"], { type: "text/plain" });
    URL.createObjectURL = jest.fn(() => "blob:download");
    URL.revokeObjectURL = jest.fn();
    jest
      .spyOn(backendUrl, "buildUrl")
      .mockResolvedValue("/rconsole/api/as-conn-1/domainRuntime/downloads/NodeManagerLogs/Machine1");
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(blob),
      clone: jest.fn().mockReturnThis(),
      json: jest.fn().mockRejectedValue(new Error("not-json")),
      status: 200,
    } as any);

    await downloadResource({
      url: "/api/as-conn-1/domainRuntime/downloads/NodeManagerLogs/Machine1",
      filename: "Machine1NodeManager.log",
      mimeType: "text/plain",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/rconsole/api/as-conn-1/domainRuntime/downloads/NodeManagerLogs/Machine1",
      expect.any(Object),
    );
    const fetchArgs = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(fetchArgs.credentials).toBe("include");
    expect(fetchArgs.headers.get("Unique-Id")).toBe("abc123");
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
  });

  it("should save blobs to a requested filename", () => {
    const anchor = {
      click: jest.fn(),
      download: "",
      href: "",
    };
    jest.spyOn(document, "createElement").mockReturnValue(anchor as any);
    URL.createObjectURL = jest.fn(() => "blob:file");
    URL.revokeObjectURL = jest.fn();

    saveBlobToFile(new Blob(["x"]), "sample.log");

    expect(anchor.href).toBe("blob:file");
    expect(anchor.download).toBe("sample.log");
    expect(anchor.click).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:file");
  });
});

describe("transport response parsing", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("surfaces non-json error text instead of a JSON syntax error", async () => {
    const response = {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: jest.fn().mockResolvedValue("Backend exploded"),
      url: "/api/test",
    } as any;

    await expect(parseResponseJson(response, "/api/test")).rejects.toMatchObject({
      name: "Request Failed",
      status: 500,
      body: "Backend exploded",
      message: expect.stringContaining("Backend exploded"),
    });
  });

  it("reports non-json success bodies with meaningful text", async () => {
    const response = {
      ok: true,
      status: 200,
      statusText: "OK",
      text: jest.fn().mockResolvedValue("plain text body"),
      url: "/api/test",
    } as any;

    await expect(parseResponseJson(response, "/api/test")).rejects.toMatchObject({
      name: "Request Failed",
      body: "plain text body",
      message: expect.stringContaining("plain text body"),
    });
  });

  it("uses parsed JSON for getDataComponent responses", async () => {
    jest.spyOn(backendUrl, "buildUrl").mockResolvedValue("/rconsole/api/test");
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: jest.fn().mockResolvedValue('{"answer":42}'),
      clone: jest.fn().mockReturnThis(),
      json: jest.fn().mockResolvedValue({}),
      url: "/rconsole/api/test",
    } as any);

    await expect(getDataComponent("/api/test")).resolves.toEqual({ answer: 42 });
  });

  it("keeps structured GET error messages separate from status data and logs the raw body verbosely", async () => {
    const statusData = {
      shoppingcart: { state: "empty", resourceData: "/api/shoppingcart" },
      providers: { current: {}, providers: [] },
    };
    const responseBody = JSON.stringify({
      messages: [
        { severity: "error", message: "Forbidden" },
        { severity: "error", message: "Operation is not permitted" },
      ],
      statusData,
    });
    const dispatch = jest.fn();
    const logger = jest.spyOn(Logger, "log").mockImplementation(() => undefined);
    setDatabus({ get: () => ({ dispatch } as any), subscribe: jest.fn() } as any);
    jest.spyOn(backendUrl, "buildUrl").mockResolvedValue("/api/test");
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      text: jest.fn().mockResolvedValue(responseBody),
      clone: jest.fn().mockReturnValue({
        json: jest.fn().mockResolvedValue({ messages: [], statusData }),
      }),
      url: "/api/test",
    } as any);

    let caught: any;
    try {
      await getDataComponent("/api/test");
    } catch (error) {
      caught = error;
    }

    expect(caught).toMatchObject({
      name: "Request Failed",
      status: 403,
      url: "/api/test",
      messages: [
        { severity: "error", message: "Forbidden" },
        { severity: "error", message: "Operation is not permitted" },
      ],
      rawResponseBody: responseBody,
    });
    expect(caught.body).toBeUndefined();
    expect(caught.message).not.toContain("statusData");
    expect(dispatch).toHaveBeenCalledWith(statusData);
    expect(logger).toHaveBeenCalledTimes(1);
    const logMessageFactory = logger.mock.calls[0][0] as () => string;
    expect(logMessageFactory()).toContain(responseBody);
  });

  it("uses normalized response text when a failed GET has no structured messages", async () => {
    jest.spyOn(Logger, "log").mockImplementation(() => undefined);
    jest.spyOn(backendUrl, "buildUrl").mockResolvedValue("/api/test");
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: jest.fn().mockResolvedValue("Backend exploded"),
      clone: jest.fn().mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error("not-json")),
      }),
      url: "/api/test",
    } as any);

    let caught: any;
    try {
      await getDataComponent("/api/test");
    } catch (error) {
      caught = error;
    }

    expect(caught).toMatchObject({
      status: 500,
      body: "Backend exploded",
      rawResponseBody: "Backend exploded",
    });
    expect(caught.messages).toBeUndefined();
  });

  it("falls back to response.json when text is unavailable", async () => {
    const response = {
      json: jest.fn().mockResolvedValue({ ok: true, messages: [] }),
    } as any;

    await expect(parseResponseJson(response, "/api/test")).resolves.toEqual({
      ok: true,
      messages: [],
    });
  });
});

describe("transport delete actions", () => {
  const originalBackendPrefix = Global.global.backendPrefix;
  const originalUnique = Global.global.unique;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.restoreAllMocks();
    Global.global.unique = "abc123";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      clone: jest.fn().mockReturnThis(),
      json: jest.fn().mockRejectedValue(new Error("not-json")),
      status: 200,
    } as any);
  });

  afterEach(() => {
    Global.global.backendPrefix = originalBackendPrefix;
    Global.global.unique = originalUnique;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("passes generic delete action resourceData to buildUrl for hosted prefixing", async () => {
    jest
      .spyOn(backendUrl, "buildUrl")
      .mockResolvedValue("/rconsole/backend/api/This%20Server/edit/data/Domain/Servers/TestServer");

    await doAction(
      "/api/This%20Server/edit/data/Domain/Servers",
      { name: "__DELETE" } as any,
      [{ resourceData: "/api/This%20Server/edit/data/Domain/Servers/TestServer" } as any],
    );

    expect(backendUrl.buildUrl).toHaveBeenCalledWith(
      "/api/This%20Server/edit/data/Domain/Servers/TestServer",
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/rconsole/backend/api/This%20Server/edit/data/Domain/Servers/TestServer",
      expect.objectContaining({
        method: "DELETE",
        credentials: "include",
        body: "{}",
      }),
    );
    const fetchArgs = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(fetchArgs.headers.get("Unique-Id")).toBe("abc123");
  });

  it("keeps desktop generic delete action resourceData rooted at api", async () => {
    jest
      .spyOn(backendUrl, "buildUrl")
      .mockResolvedValue("/api/This%20Server/edit/data/Domain/Servers/TestServer");

    await doAction(
      "/api/This%20Server/edit/data/Domain/Servers",
      { name: "__DELETE" } as any,
      [{ resourceData: "/api/This%20Server/edit/data/Domain/Servers/TestServer" } as any],
    );

    expect(backendUrl.buildUrl).toHaveBeenCalledWith(
      "/api/This%20Server/edit/data/Domain/Servers/TestServer",
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/This%20Server/edit/data/Domain/Servers/TestServer",
      expect.objectContaining({
        method: "DELETE",
        credentials: "include",
        body: "{}",
      }),
    );
  });
});
