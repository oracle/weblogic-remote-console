/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { ExternalHelp } from "./pdj";
import { Resource } from "./rdj";

export interface Response {
  messages?: Message[];
  resourceData?: Resource;
  reinit?: boolean;
}

export interface Message {
  severity: string;
  message?: string;
  detail?: string;
  property?: string;
}

export type ResponseError = Error & {
  body?: string;
  messages?: Message[];
  rawResponseBody?: string;
  status?: number;
  url?: string;
};

export interface HelpData {
  detailedHelpHTML?: string;
  externalHelp?: ExternalHelp;
  helpLabel?: string;
  helpSummaryHTML?: string;
}
