/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Global } from "../global";
import { tryGetDatabus } from "wrc/integration/databus-accessor";
import { emitRefresh } from "../refresh";
import { Action, PDJ } from "../typedefs/pdj";
import {
  PropertyValueHolder,
  RDJ,
  Reference,
  ResponseWithStatusData,
} from "../typedefs/rdj";

import { parseIfJson } from "./model-utils";
import { buildUrl, getBackendBase } from "../backend-url";
import * as Logger from "ojs/ojlogger";

const _statusDataReporter = async (response: Response) => {

  // Clone only if available to avoid consuming the original body in tests/mocks
  let clonedResponse: Response | undefined;
  try {
    if (typeof (response as any)?.clone === "function") {
      clonedResponse = (response as any).clone();
    }
  } catch (_e) {
    clonedResponse = undefined;
  }

  if (clonedResponse) {
    try {
      const responseWithStatusData =
        (await clonedResponse.json()) as ResponseWithStatusData;

      const bus = tryGetDatabus();
      if (responseWithStatusData?.statusData && bus) {
        bus.get().dispatch(responseWithStatusData.statusData);
      }
    } catch (_e) {
      // ignore parse errors on status data reporter
    }
  }

  return response;
};

export const fixOrigin = (url: string) => {
  const backendPrefix = Global.global.backendPrefix;

  if (backendPrefix) {
    try {
      const parsedUrl = new URL(url, window.location.href);
      url = new URL(
        backendPrefix + parsedUrl.pathname + parsedUrl.search + parsedUrl.hash,
      ).href;
    } catch (e) {
      if (e instanceof Error) {
        Logger.error(e.message);
      }
      try { Logger.error(JSON.stringify(e)); } catch { Logger.error(String(e)); }
      // work with the original url...
    }
  }
  return url;
};

export const _post = async (url: string, body: string | FormData) => {
  const headersTemplate = {
    Accept: "application/json",
    "Unique-Id": Global.global.unique || "",
  };

  const headers = new Headers(headersTemplate);

  // only set Content-Type when we're not posting a multipart form
  // otherwise leave it up to the browser so it can set the Content-Type to include
  // the boundary expression that is needed to delimit form fields...
  if (!(body instanceof FormData)) {
    headers.append("Content-Type", "application/json");
  }

  const target = await buildUrl(url);
  return fetch(target, {
    method: "POST",
    credentials: "include",
    headers,
    body,
  })
    .then(_statusDataReporter);
};

const _delete = async (url: string) => {
  const headersTemplate = {
    Accept: "application/json",
    "Unique-Id": Global.global.unique || "",
  };

  const headers = new Headers(headersTemplate);
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({});

  const target = await buildUrl(url);
  return fetch(target, {
    method: "DELETE",
    credentials: "include",
    headers,
    body,
  })
    .then(_statusDataReporter)
    .then((response) => {
      // refresh the navtree to reflect the changes to the mbean collection...
      emitRefresh({ scope: { content: false, navtree: true } });
      return response;
    });
};

/**
 * Builds a request body that supports optional file uploads.
 * - With files: returns FormData containing a JSON "requestBody" blob and file fields
 * - Without files: returns JSON string of the payload
 */
const _buildBodyWithOptionalFiles = (
  payload: unknown,
  files?: Record<string, File>
): string | FormData => {
  if (files && Object.keys(files).length > 0) {
    const form = new FormData();
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    form.append("requestBody", blob);
    for (const key of Object.keys(files)) {
      form.append(key, files[key]);
    }
    return form;
  }
  return JSON.stringify(payload);
};

/**
 * Sends a POST request to the specified RDJ URL with the provided changes and optional files.
 *
 * @param {string} rdjUrl - The URL to send the request to.
 * @param {*} changes - A dictionary containing the changes to be sent.
 * @param {Record<string, File>} [files] - An optional dictionary of files to be sent.
 * @returns {Promise<Response>} The response object from the server.
 */
export const doUpdate = async (
  rdjUrl: string,
  changes: any,
  files?: Record<string, File>,
): Promise<Response> => {
  const body = _buildBodyWithOptionalFiles({ data: changes }, files);
  return _post(rdjUrl, body);
};

/**
 * Invokes a form/table action
 *
 * @async
 * @param {string} actionUrl - the URL on which to perform the action
 * @param {Action} action - the Action to invoke
 * @param {Reference[]} references - references to be affected by this action
 * @returns
 */
export const doAction = async (
  actionUrl: string,
  action: Action | undefined,
  references: Reference[] | string[] = [],
  payloadOverride?: any,
) => {
  // Make sure that the action param is present on the action url --
  // actions with invokers (e.g. form actions) contain an action parameter already,
  // actions without invokers (e.g. table actions) need to have it added
  //
  // the actionUrl may be relative so use a base url so URL can work with it
  // then strip it off after fixing the search params...
  const urlObject = new URL(actionUrl, window.origin);
  const searchParams = new URLSearchParams(urlObject.search);

  if (!searchParams.has("action") && action) {
    searchParams.set("action", action.name);
    urlObject.search = searchParams.toString();

    // Keep relative URL shape for tests (avoid absolute href)
    actionUrl = urlObject.pathname + urlObject.search + urlObject.hash;
  }

  // Normalize to relative URL for consistency (even when action is already present)
  actionUrl = urlObject.pathname + urlObject.search + urlObject.hash;

  // The payload may be an array of References to a resource or simple strings
  let values;
  if (references && references.length > 0 && typeof references[0] === "string")
    values = references.map((r) => {
      return { value: parseIfJson(r as string) };
    });
  else
    values = references.map((r: Reference) => {
      return { value: { resourceData: r.resourceData } };
    });

  const payload = values.length > 0 ? { rows: { value: values } } : {};

  // Delete is a special case...
  if (action?.name === "__DELETE") {
    let chainedDeletes: Promise<any> | undefined;

    values.forEach((value) => {
      const deleteFunc = () => {
        const url = (value.value as Reference).resourceData;
        if (url) {
          return _delete(urlObject.origin + url);
        } else {
          throw Error("missing resourceData");
        }
      };

      if (chainedDeletes) {
        chainedDeletes.then(deleteFunc);
      } else {
        chainedDeletes = deleteFunc();
      }
    });

    if (!chainedDeletes) {
      throw new Error("nothing to delete");
    }

    return chainedDeletes;
  }

  if (payloadOverride !== undefined) {
    return _post(actionUrl, JSON.stringify(payloadOverride));
  }

  return _post(actionUrl, JSON.stringify(payload));
};

export const doActionInput = async (
url: string, changes: Record<string, PropertyValueHolder>, rows?: PropertyValueHolder, files?: Record<string, File> | undefined,
): Promise<Response> => {
  const payload: { data: Record<string, PropertyValueHolder>; rows?: any } = {
    data: changes,
  };

  if (rows) payload.rows = rows;

  const body = _buildBodyWithOptionalFiles(payload, files);
  return _post(url, body);
};

/**
 * Retrieves RDJ and PDJ data from the specified URLs.
 *
 * If the RDJ URL starts with 'file://', it reads the data from local files. This will be the
 * case when running everypage..
 *
 * Otherwise, it sends HTTP requests to retrieve the data.
 *
 * @async
 * @param {string} rdjUrl - The URL to retrieve RDJ data from.
 * @param {string|undefined} pdjUrl - The URL to retrieve PDJ data from. If undefined, it will be inferred from the RDJ data.
 * @returns {Promise<[RDJ, PDJ|undefined]>} A promise resolving to an array containing the RDJ and PDJ data.
 */
export const getData = async (
  rdjUrl: string,
  pdjUrl: string | undefined,
  context?: string
): Promise<[RDJ, PDJ | undefined]> => {
  if (rdjUrl.startsWith("file://")) {
    const fs = require("fs");
    const rdjData = JSON.parse(
      fs.readFileSync(new URL(rdjUrl), { encoding: "utf-8" }),
    ) as RDJ;

    let pdjData = rdjData.inlinePageDescription;

    if (pdjUrl) {
      pdjData = JSON.parse(
        fs.readFileSync(new URL(pdjUrl), { encoding: "utf-8" }),
      ) as PDJ;
    }

    return [rdjData, pdjData];
  } else {
    const rdjData = (await getDataComponent(rdjUrl, context)) as RDJ;

    let pdjData = rdjData.inlinePageDescription;

    if (!pdjData && !pdjUrl) {
      pdjUrl = rdjData.pageDescription;
    }

    if (pdjUrl) {
      pdjData = (await getDataComponent(pdjUrl, context)) as PDJ;
    }

    return [rdjData, pdjData];
  }
};

const getDataComponentRaw = async (url: string, context?: string) => {
  const headers = new Headers();
  headers.append("Unique-Id", Global.global.unique || "");

  let fixedUrl = await buildUrl(url);

  // append the context if any
  if (context) {
    const urlObject = new URL(fixedUrl, window.location.href);
    urlObject.searchParams.append("context", context);
    fixedUrl = urlObject.pathname + urlObject.search + urlObject.hash;
  }

  const res = await fetch(fixedUrl, {
    credentials: "include",
    headers,
  }).then(_statusDataReporter);

  if (!res.ok) {
    let bodyText: string | undefined;
    try {
      bodyText = await res.text();
    } catch (_e) {
      bodyText = undefined;
    }
    const err: any = new Error(
      `HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ""} when fetching ${fixedUrl}`,
    );
    err.status = res.status;
    if (bodyText) err.body = bodyText;
    throw err;
  }

  return res;
};

export const getDataComponentText = async (url: string, context?: string) => {
  return (await getDataComponentRaw(url, context)).text();
};

export const getDataComponent = async (url: string, context?: string) => {
  return (await getDataComponentRaw(url, context)).json();
};

// ---------------------------------------------------------------------------
// Periodic server status polling (/api/-current-/status)
// ---------------------------------------------------------------------------

const STATUS_URL = "/api/-current-/status";
let _statusTimer: any;

/**
 * Performs a single fetch to the status endpoint.
 * Response is intentionally ignored for now; it is piped through the
 * _statusDataReporter to allow future statusData handling.
 */
export const fetchServerStatus = async (): Promise<Response | void> => {
  try {
    const headers = new Headers();
    headers.append("Unique-Id", Global.global.unique || "");

    const target = await buildUrl(STATUS_URL);
    const res = await fetch(target, {
      credentials: "include",
      headers,
    }).then(_statusDataReporter);

    // Intentionally ignore body – consumers will be added later.
    return res;
  } catch (_e) {
    // Ignore transient errors; next interval will re-attempt
  }
};

/**
 * Starts polling the status endpoint every intervalMs milliseconds.
 * Safe to call multiple times; existing timer is cleared.
 */
export const startStatusPolling = (intervalMs: number = 15000) => {
  stopStatusPolling();
  // Fire once immediately, then on interval
  fetchServerStatus();
  _statusTimer = setInterval(fetchServerStatus, intervalMs);
};

/**
 * Stops the status polling timer if running.
 */
export const stopStatusPolling = () => {
  if (_statusTimer) {
    clearInterval(_statusTimer);
    _statusTimer = undefined;
  }
};

// Auto-start in runtime (but skip under Jest tests)
const _isTestEnv =
  !!(globalThis as any)?.process?.env?.JEST_WORKER_ID ||
  (globalThis as any)?.process?.env?.NODE_ENV === "test";

if (typeof window !== "undefined" && !_isTestEnv) {
  try {
    startStatusPolling();
  } catch (_e) {
    // no-op
  }
}
