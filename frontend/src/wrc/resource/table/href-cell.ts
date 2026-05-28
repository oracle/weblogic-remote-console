/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Column } from "../../shared/typedefs/pdj";
import { PropertyValueHolder } from "../../shared/typedefs/rdj";

export type HrefCellData = {
  downloadFilename?: string;
  isHrefCell: true;
  label: string;
  mimeType?: string;
  url: string;
};

type HrefValue = {
  href?: string;
  label?: string;
};

function isHrefValue(value: unknown): value is HrefValue {
  return typeof value === "object" && value !== null;
}

export function isHrefCellData(value: unknown): value is HrefCellData {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as HrefCellData).isHrefCell === true &&
    typeof (value as HrefCellData).url === "string"
  );
}

export function buildHrefCellData(
  column: Column | undefined,
  holder: PropertyValueHolder | undefined,
): HrefCellData | undefined {
  if (column?.type !== "href" || !isHrefValue(holder?.value)) {
    return undefined;
  }

  const hrefValue = holder.value;
  const hrefMarkup = typeof hrefValue.href === "string" ? hrefValue.href.trim() : "";
  if (!hrefMarkup) return undefined;

  const container = document.createElement("div");
  container.innerHTML = hrefMarkup;

  const anchor = container.querySelector("a");
  if (!anchor) return undefined;

  const url = anchor.getAttribute("href");
  if (!url) return undefined;

  return {
    downloadFilename: anchor.getAttribute("download") || undefined,
    isHrefCell: true,
    label:
      typeof hrefValue.label === "string" && hrefValue.label.length > 0
        ? hrefValue.label
        : anchor.textContent || "",
    mimeType: anchor.getAttribute("type") || undefined,
    url,
  };
}
