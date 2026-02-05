/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Response } from "wrc/shared/typedefs/common";

/**
 * Returns true when the response has no ERROR-severity messages (case-insensitive).
 */
export function isSuccessful(messageResponse: Response | undefined | null): boolean {
  if (!messageResponse) return false;
  const messages = messageResponse.messages || [];
  return !messages.some(m => (m?.severity || "").toUpperCase() === "ERROR");
}
