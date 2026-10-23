/**
 * @license
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import {
  applyMessageTimeoutPolicy,
  DEFAULT_STATUS_MESSAGE_TIMEOUT,
} from "../message-utils";

describe("message timeout policy", () => {
  it.each(["info", "confirmation"] as const)(
    "uses a 60 second default for %s messages",
    (severity) => {
      expect(applyMessageTimeoutPolicy({ severity })).toEqual({
        severity,
        autoTimeout: DEFAULT_STATUS_MESSAGE_TIMEOUT,
      });
    },
  );

  it("preserves a valid caller-provided informational timeout", () => {
    expect(
      applyMessageTimeoutPolicy({ severity: "info", autoTimeout: 15000 }),
    ).toEqual({ severity: "info", autoTimeout: 15000 });
  });

  it("preserves an explicitly persistent informational message", () => {
    expect(
      applyMessageTimeoutPolicy({ severity: "info", autoTimeout: -1 }),
    ).toEqual({ severity: "info", autoTimeout: -1 });
  });

  it.each(["error", "warning"] as const)(
    "keeps %s messages open until dismissed",
    (severity) => {
      expect(
        applyMessageTimeoutPolicy({ severity, autoTimeout: 10000 }),
      ).toEqual({ severity, autoTimeout: -1 });
    },
  );
});
