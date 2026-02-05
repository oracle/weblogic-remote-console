/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

/**
 * Ambient declaration for the global resource context injected by the legacy app (appController.js).
 * This allows TypeScript/Preact code to safely reference window.wrcResourceContext with proper typing.
 */
import type { ResourceContext } from "../components/wrc/integration/resource-context";

declare global {
  interface Window {
    wrcResourceContext?: ResourceContext;
  }
}

declare namespace preact.JSX {
  interface IntrinsicElements {
    'wrc-branding-header': any;
    'wrc-branding-area': any;
  }
}

export {};
