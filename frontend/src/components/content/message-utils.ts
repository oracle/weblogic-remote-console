/**
 * @license
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ojMessage } from "ojs/ojmessage";

export const DEFAULT_STATUS_MESSAGE_TIMEOUT = 60000;

export const applyMessageTimeoutPolicy = (
  message: ojMessage.Message,
): ojMessage.Message => {
  const normalizedMessage = { ...message };
  const severity = normalizedMessage.severity?.toLowerCase();

  if (severity === "error" || severity === "warning") {
    normalizedMessage.autoTimeout = -1;
    return normalizedMessage;
  }

  if (normalizedMessage.autoTimeout === -1) {
    return normalizedMessage;
  }

  if (severity === "confirmation" || severity === "info") {
    const timeout = Number(normalizedMessage.autoTimeout);
    if (
      typeof normalizedMessage.autoTimeout === "undefined" ||
      !Number.isFinite(timeout) ||
      timeout < 1000 ||
      timeout > 60000
    ) {
      normalizedMessage.autoTimeout = DEFAULT_STATUS_MESSAGE_TIMEOUT;
    }
  }

  return normalizedMessage;
};
