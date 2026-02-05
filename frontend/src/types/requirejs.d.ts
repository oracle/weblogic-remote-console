/**
 * Minimal ambient types so TypeScript recognizes RequireJS's toUrl() in AMD runtime.
 * This lets code call require.toUrl("images/logo.svg") and get a string URL.
 *
 * Note: We keep the typing minimal to avoid collisions with any other global require typings.
 */

type RequireCallback = (...args: any[]) => void;

interface RequireWithToUrl {
  (deps: string[], callback: RequireCallback): void;
  (moduleId: string): any; // CommonJS-style single module require, returns any (e.g., require("fs"))
  toUrl: (moduleId: string) => string;
}

declare var require: RequireWithToUrl;
declare var requirejs: RequireWithToUrl;
