/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { HelpData } from "../typedefs/common";

export const extractHelpData = (everyField: HelpData[]): HelpData[] => {
  return everyField.map((helpData: HelpData) => {
    return {
      detailedHelpHTML: helpData.detailedHelpHTML,
      externalHelp: helpData.externalHelp,
      helpLabel: helpData.helpLabel,
      helpSummaryHTML: helpData.helpSummaryHTML
    };
  });
};

/**
 * If the provided string is valid JSON representing an object or array,
 * return the parsed value; otherwise return the original string.
 */
export function parseIfJson<T>(input: string): T | string {
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as T;
    }
  } catch (_e) {
    // ignore parse error and return original
  }
  return input;
}
