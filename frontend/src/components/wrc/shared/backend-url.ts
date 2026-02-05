/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 *
 * Runtime resolver for backend base URL with layered fallbacks.
 *
 * Responsibilities:
 * - Resolve a deployment/base prefix for backend requests (Global.global.backendPrefix)
 * - Provide helpers to build URLs while keeping relative shape for same-origin calls (useful for tests)
 *
 * Resolution precedence (highest to lowest):
 *  1) window.WRC_CONFIG.backendBaseUrl (host or host+path, e.g., "http://localhost:8012" or "/console")
 *  2) <meta name="wrc-backend-url" content="...">
 *  3) <script id="wrc-config" type="application/json">{"backendBaseUrl": "..."}</script>
 *  4) GET ./wrc-config.json (same origin)
 *  5) process.env.WRC_BACKEND_URL (if replaced by bundler)
 *  6) Derive from window.location (directory portion) or empty string
 *
 * Notes:
 * - We intentionally do not add trailing slash when storing backendPrefix. Callers should join paths safely.
 * - This module sets Global.global.backendPrefix on first import and exposes getBackendBase/buildUrl.
 */

import { Global } from "./global";

declare global {
  interface Window {
    WRC_CONFIG?: { backendBaseUrl?: string };
  }
}

type Resolved = string | undefined;

/**
 * Normalize a base string:
 * - Trim whitespace
 * - Remove trailing slash (except if it&#39;s just "/")
 */
function normalizeBase(base: string): string {
  const t = base.trim();
  if (!t) return "";
  if (t === "/") return "/";
  return t.endsWith("/") ? t.slice(0, -1) : t;
}

/**
 * Read from meta tag: <meta name="wrc-backend-url" content="...">
 */
function fromMeta(): Resolved {
  try {
    const el = document.querySelector('meta[name="wrc-backend-url"]') as HTMLMetaElement | null;
    const v = el?.content?.trim();
    return v ? v : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Read from embedded JSON script: <script id="wrc-config" type="application/json">...</script>
 */
function fromInlineJson(): Resolved {
  try {
    const el = document.getElementById("wrc-config");
    if (!el) return undefined;
    const text = el.textContent || el.innerHTML || "";
    if (!text) return undefined;
    const parsed = JSON.parse(text);
    const v = parsed?.backendBaseUrl;
    return typeof v === "string" ? v : undefined;
  } catch {
    return undefined;
  }
}

/**
 * GET ./wrc-config.json from same origin.
 * Expected shape: { "backendBaseUrl": "..." }
 */
async function fromConfigJson(): Promise<Resolved> {
  try {
    const res = await fetch("wrc-config.json", {
      credentials: "same-origin",
      cache: "no-cache",
    });

    // Treat 404 as an expected absence with no console noise
    if (res.status === 404) return undefined;
    if (!res.ok) return undefined;

    // Robust parse: tolerate empty body or non-JSON content types
    let data: any = undefined;
    const ct = res.headers?.get("content-type") || "";
    if (ct.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = undefined;
      }
    } else {
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : undefined;
      } catch {
        data = undefined;
      }
    }

    const v = data?.backendBaseUrl;
    return typeof v === "string" ? v : undefined;
  } catch {
    // Network errors or CORS issues: ignore and fall through to other sources
    return undefined;
  }
}

/**
 * Bundler-defined env fallback. May be replaced at build time.
 */
function fromEnv(): Resolved {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (process as any)?.env;
    const v = env?.WRC_BACKEND_URL;
    return typeof v === "string" ? v : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Derive from window.location. For apps deployed under a subpath, we take the directory portion.
 */
function fromLocation(): Resolved {
  try {
    const here = new URL(window.location.href);
    // Keep just origin + directory portion of pathname (no trailing slash)
    const dir = here.pathname.endsWith("/") ? here.pathname.slice(0, -1) : here.pathname.replace(/[^/]+$/, "");
    const joined = `${here.origin}${dir}`;
    return normalizeBase(joined);
  } catch {
    return "";
  }
}

let _resolvedBase: string | undefined;
let _initPromise: Promise<string | undefined> | undefined;

async function resolveOnce(): Promise<string | undefined> {
  if (_resolvedBase !== undefined) return _resolvedBase;

  // 1) window.WRC_CONFIG
  const fromWindow = window?.WRC_CONFIG?.backendBaseUrl;
  if (typeof fromWindow === "string" && fromWindow.trim()) {
    _resolvedBase = normalizeBase(fromWindow);
    return _resolvedBase;
  }

  // 2) meta
  const meta = fromMeta();
  if (meta) {
    _resolvedBase = normalizeBase(meta);
    return _resolvedBase;
  }

  // 3) inline JSON
  const inlineJson = fromInlineJson();
  if (inlineJson) {
    _resolvedBase = normalizeBase(inlineJson);
    return _resolvedBase;
  }

  // 4) config json
  const cfg = await fromConfigJson();
  if (cfg) {
    _resolvedBase = normalizeBase(cfg);
    return _resolvedBase;
  }

  // 5) env
  const env = fromEnv();
  if (env) {
    _resolvedBase = normalizeBase(env);
    return _resolvedBase;
  }

  // 6) location
  _resolvedBase = normalizeBase(fromLocation() || "");
  return _resolvedBase;
}

/**
 * Public: ensure backend prefix is resolved and stored in Global.global.backendPrefix.
 * Returns the resolved base (may be empty string if not determinable).
 */
export async function getBackendBase(): Promise<string> {
  if (_initPromise) {
    await _initPromise;
    return _resolvedBase || "";
  }
  _initPromise = resolveOnce();
  try {
    await _initPromise;
  } finally {
    _initPromise = undefined;
  }

  // Late-binding guard: if resolution ran before window.WRC_CONFIG/global were available,
  // prefer any non-empty Global.global.backendPrefix now.
  try {
    const gp = (Global as any)?.global?.backendPrefix;
    if ((!_resolvedBase || _resolvedBase === "") && typeof gp === "string" && gp.trim()) {
      _resolvedBase = normalizeBase(gp);
    }
  } catch {
    // ignore
  }

  const val = _resolvedBase || "";
  Global.global.backendPrefix = val;
  return val;
}

/**
 * Build a request URL relative to the backend base.
 * - path may be absolute (http/https) or relative ("/api/..."). If absolute and cross-origin, returns absolute.
 * - For same-origin targets, returns a relative pathname+search (to satisfy unit tests that assert relative URLs).
 */
export async function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<string> {
  let base = await getBackendBase();
  // Always prefer the latest Global.global.backendPrefix if present (handles early module-load callers like status polling)
  try {
    const gp = (Global as any)?.global?.backendPrefix;
    if (typeof gp === "string" && gp.trim()) {
      base = normalizeBase(gp);
    }
  } catch {
    // ignore
  }

  // Absolute-like path?
  const isAbs = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path);
  if (isAbs) {
    const u = new URL(path);
    return toRelativeIfSameOrigin(u);
  }

  // Join with base (which may be origin or origin+prefix or just "")
  // Important: if base includes a pathname (e.g., "/foo/bar"), we must append the
  // provided path to that prefix. Using new URL("/api", base) would drop the prefix.
  // Strategy:
  //  - Build a base URL object (default to origin when base is empty)
  //  - Ensure trailing slash on the base href
  //  - Strip leading slashes from the provided path and resolve relative to base
  const baseObj = base
    ? new URL(base, window.location.href)
    : new URL(window.location.origin + "/", window.location.href);

  let baseHref = baseObj.toString();
  if (!baseHref.endsWith("/")) baseHref += "/";

  const relPath = path.replace(/^\/+/, "");
  const u = new URL(relPath, baseHref);

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined) continue;
      u.searchParams.set(k, String(v));
    }
  }

  return toRelativeIfSameOrigin(u);
}

function toRelativeIfSameOrigin(u: URL): string {
  try {
    const sameOrigin = u.origin === window.location.origin;
    // Keep relative shape for same-origin to align with tests
    return sameOrigin ? u.pathname + u.search + u.hash : u.toString();
  } catch {
    return u.toString();
  }
}

// Kick off resolution on module load; don&#39;t block app startup
// It is safe if this fails; callers can still call getBackendBase() which awaits the result.
void getBackendBase().catch(() => {
  // noop
});
