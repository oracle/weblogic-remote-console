/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 *
 * Utilities for generating deployment-safe asset URLs, plus a Preact-friendly <AssetImg />.
 *
 * Problem this solves:
 * - Hard-coded absolute paths ("/images/foo.svg") break when the app is deployed under a subpath
 *   (e.g. http://host:port/rconsole/). This module centralizes URL generation to honor the app's
 *   deployment base path (Global.global.backendPrefix if provided/inferred).
 *
 * Usage:
 *   import { assetUrl, AssetImg } from "wrc/shared/url";
 *
 *   // As a function:
 *   <img src={assetUrl("images/logo.svg")} alt="Logo" />
 *   <img src={assetUrl("/images/logo.svg")} alt="Logo" />  // leading slash OK
 *
 *   // As a Preact component:
 *   <AssetImg src="images/logo.svg" alt="Logo" class="my-logo" />
 *
 * Notes:
 * - Absolute URLs (http:, https:, data:, blob:, file:) are returned unchanged.
 * - When backendPrefix is set (via wrc-resource or wrc-nav-tree props or inference), we join the
 *   provided path to that base. Otherwise we resolve relative to window.location.
 */

import { Global } from "./global";
import { ComponentProps, h } from "preact";

// Detects if a URL is absolute (has a scheme) or protocol-relative
function isAbsoluteLike(url: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url);
}

// Ensure a base href string ends with a single slash
function withTrailingSlash(href: string): string {
  return href.endsWith("/") ? href : href + "/";
}

// Best-effort computation of the application base URL where assets are served from.
// Prefers Global.global.backendPrefix when set. Falls back to directory portion of window.location.
function getAppBaseHref(): string {
  const bp = Global.global.backendPrefix;
  try {
    if (bp) {
      // Normalize to URL and ensure it ends with a slash
      const u = new URL(bp, window.location.href);
      return withTrailingSlash(u.href);
    }
  } catch {
    // ignore and fall through to window.location
  }

  // Derive from current location: directory part of the pathname
  try {
    const here = new URL(window.location.href);
    const dir =
      here.pathname.endsWith("/")
        ? here.pathname
        : here.pathname.replace(/[^/]+$/, "");
    const normalized = withTrailingSlash(`${here.origin}${dir}`);
    return normalized;
  } catch {
    return "/";
  }
}

/**
 * Returns a deployment-safe URL for a static asset.
 * - If input is absolute (http(s), data, blob, file, or //host form), return as-is.
 * - Otherwise, join with the app base href (backendPrefix if present, or current location's dir).
 */
export function assetUrl(path: string): string {
  if (!path) return path;

  // already absolute? return unchanged
  if (isAbsoluteLike(path)) return path;

  const base = getAppBaseHref();

  // avoid double slashes: join base + relative path
  const relative = path.startsWith("/") ? path.slice(1) : path;
  try {
    return new URL(relative, base).toString();
  } catch {
    // If URL construction fails, fallback to naive join
    return base + relative;
  }
}

/**
 * Preact-friendly image component that resolves src through assetUrl().
 * Accepts all native <img> props, but "src" is required.
 */
export function AssetImg(props: ComponentProps<"img"> & { src: string }) {
  const { src, ...rest } = props;
  const resolved = assetUrl(src);
  // eslint-disable-next-line react/jsx-no-target-blank
  return <img src={resolved} {...(rest as any)} />;
}

/**
 * Optional hook variant in case you want to memoize in a component.
 */
export function resolveAsset(src: string): string {
  return assetUrl(src);
}

/**
 * AMD/RequireJS-friendly resolver. Uses require.toUrl() to turn a module-like path into a URL.
 * Example: <img src={requireAsset('images/logo.svg')} />
 * If the path starts with '/', it will be stripped so resolution is relative to baseUrl/paths.
 */
export function requireAsset(path: string): string {
  try {
    const req: any = typeof require !== "undefined" ? (require as any) : undefined;
    if (req && typeof req.toUrl === "function") {
      const rel = path.startsWith("/") ? path.slice(1) : path;
      return req.toUrl(rel);
    }
  } catch {
    // ignore and fall back
  }
  // Fallback to assetUrl logic when require is not available (e.g., tests)
  return assetUrl(path);
}

/**
 * Preact <img> that resolves src using RequireJS when available, otherwise falls back to assetUrl.
 */
export function RequireImg(props: ComponentProps<"img"> & { src: string }) {
  const { src, ...rest } = props;
  const resolved = requireAsset(src);
  return <img src={resolved} {...(rest as any)} />;
}
