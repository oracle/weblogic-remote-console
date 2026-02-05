/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { JSX } from "preact";
import "oj-c/button";
import { requireAsset } from "wrc/shared/url";
import type { ToolbarActionEvent, ToolbarButtonConfig } from "./toolbar-types";

/**
 * Build a consistent set of toolbar buttons for Form and Table toolbars.
 * - Uses oj-c-button with optional Redwood icon class or image.
 * - Consumers should wrap returned elements in <WeightedSort> to respect data-weight.
 */
export function buildToolbarButtons(
  buttons: Record<string, ToolbarButtonConfig>
): JSX.Element[] {
  const elements: JSX.Element[] = [];

  Object.keys(buttons).forEach((key) => {
    const cfg = buttons[key];

    if (!cfg.isVisible()) {
      return;
    }

    const label = cfg.label ?? "";
    const disabled = !cfg.isEnabled();
    const handleAction = (event: ToolbarActionEvent) => {
      event.preventDefault();
      cfg.action(event);
    };

    const startIcon = cfg.iconClass ? (
      <span slot="startIcon" class={cfg.iconClass}></span>
    ) : cfg.iconFile ? (
      <img
        class="button-icon"
        slot="startIcon"
        src={requireAsset(`wrc/assets/images/${cfg.iconFile}.png`)}
        alt={label}
      />
    ) : null;

    elements.push(
      <oj-c-button
        chroming="borderless"
        onojAction={handleAction}
        accessKey={cfg.accesskey}
        disabled={disabled}
        label={label}
        data-weight={cfg.weight}
        data-testid={key}
      >
        {startIcon}
      </oj-c-button>
    );
  });

  return elements;
}
