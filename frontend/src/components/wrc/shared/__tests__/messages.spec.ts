/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle
 */

import { isSuccessful } from "wrc/shared/messages";
import { Response } from "wrc/shared/typedefs/common";

describe("isSuccessful", () => {
  test("returns false for undefined/empty response", () => {
    expect(isSuccessful(undefined)).toBe(false);
    expect(isSuccessful(null as unknown as Response)).toBe(false);
  });

  test("returns true when messages is undefined", () => {
    const resp: Response = {};
    expect(isSuccessful(resp)).toBe(true);
  });

  test("returns true when no ERROR severities are present", () => {
    const resp: Response = {
      messages: [
        { severity: "info", message: "ok", property: "" },
        { severity: "WARNING", message: "warn", property: "" },
      ],
    };
    expect(isSuccessful(resp)).toBe(true);
  });

  test("returns false when severity === 'ERROR' (exact)", () => {
    const resp: Response = {
      messages: [
        { severity: "ERROR", message: "bad", property: "" },
      ],
    };
    expect(isSuccessful(resp)).toBe(false);
  });

  test("returns false when severity is lower-case 'error' (case-insensitive)", () => {
    const resp: Response = {
      messages: [
        { severity: "error", message: "bad", property: "" },
      ],
    };
    expect(isSuccessful(resp)).toBe(false);
  });

  test("returns false when mixed severities include an error", () => {
    const resp: Response = {
      messages: [
        { severity: "info", message: "ok", property: "" },
        { severity: "ERROR", message: "bad", property: "" },
        { severity: "warning", message: "warn", property: "" },
      ],
    };
    expect(isSuccessful(resp)).toBe(false);
  });
});
