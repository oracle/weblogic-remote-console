/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
// Do not change this file.
export { ErrorBoundary } from "./error-boundary";
declare global {
namespace preact.JSX {
      interface IntrinsicElements {
      'wrc-error-boundary': any;
      }
    }
  }
