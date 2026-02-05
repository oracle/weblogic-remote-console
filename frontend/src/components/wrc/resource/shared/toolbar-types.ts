/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
 
import type { CButtonElement } from "oj-c/button";
 
/**
 * Common toolbar button configuration used by both form and table toolbars.
 * - Normalize label, visibility, enablement, action, weighting, and icon hints.
 * - Keep icon as either a Redwood CSS class (iconClass) or a fallback image file (iconFile w/o .png).
 */
export type ToolbarActionEvent = CButtonElement.ojAction;

export type ToolbarButtonConfig = {
  accesskey?: string;
  isEnabled: () => boolean;
  action: (event: ToolbarActionEvent) => void;
  isVisible: () => boolean;
  weight?: number;
  label?: string;
  iconClass?: string;
  iconFile?: string; // base name, without .png extension
  className?: string; // optional CSS class for the oj-c-button
  ref?: any; // optional, allows toolbars to attach a ref if needed
};
