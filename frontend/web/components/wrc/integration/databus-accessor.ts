/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 *
 * Databus accessor for non-UI .ts modules.
 * Prefer dependency injection where possible; this is a typed service-locator fallback.
 * The app bootstrap should call setDatabus() exactly once.
 */
import type { Databus } from "wrc/integration/databus";

let _current: Databus | null = null;

/**
 * Set the global Databus instance once at bootstrap.
 */
export function setDatabus(bus: Databus) {
  _current = bus;
}

/**
 * Get the Databus instance or throw if it hasn't been set.
 * Use tryGetDatabus() if you prefer a non-throwing check.
 */
export function getDatabus(): Databus {
  if (!_current) {
    throw new Error("Databus not set. Call setDatabus() during app bootstrap.");
  }
  return _current;
}

/**
 * Non-throwing getter for optional usage.
 */
export function tryGetDatabus(): Databus | null {
  return _current;
}
