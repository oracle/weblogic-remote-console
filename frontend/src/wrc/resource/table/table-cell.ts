/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Column } from "../../shared/typedefs/pdj";
import {
  PropertyValue,
  PropertyValueArrayMember,
  PropertyValueHolder,
  Reference,
} from "../../shared/typedefs/rdj";
import { buildHrefCellData, HrefCellData } from "./href-cell";

type ThrowableCellValue = {
  cause?: ThrowableCellValue | null;
  message?: string | null;
};

export type TableCellValue = HrefCellData | number | string;

export const TABLE_CELL_TEXT_CLASS = "wlstable-cell";
export const TABLE_CELL_MULTILINE_CLASS = "wlstable-cell--multiline";
export const TABLE_CELL_THROWABLE_CLASS = "wlstable-cell--throwable";

function isArrayMember(value: unknown): value is PropertyValueArrayMember {
  return typeof value === "object" && value !== null && "value" in value;
}

function isReference(value: unknown): value is Reference {
  return typeof value === "object" && value !== null && ("label" in value || "resourceData" in value);
}

function isThrowableCellValue(value: unknown): value is ThrowableCellValue {
  return typeof value === "object" && value !== null && ("message" in value || "cause" in value);
}

function formatThrowableValue(value: ThrowableCellValue, depth = 0): string[] {
  const indent = "  ".repeat(depth);
  const lines: string[] = [];
  const message = typeof value.message === "string" ? value.message : "";

  if (message.length > 0) {
    lines.push(`${indent}${message}`);
  }

  if (value.cause && isThrowableCellValue(value.cause)) {
    const nextDepth = message.length > 0 ? depth + 1 : depth;
    lines.push(...formatThrowableValue(value.cause, nextDepth));
  }

  return lines;
}

function formatScalarValue(value: PropertyValue | unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value !== "object") return typeof value === "boolean" ? String(value) : `${value}`;
  if (isReference(value)) return value.label || "";
  if (isThrowableCellValue(value)) return formatThrowableValue(value).join("\n");
  return "";
}

export function buildTableCellValue(
  column: Column | undefined,
  holder: PropertyValueHolder | undefined,
): TableCellValue {
  const hrefCellData = buildHrefCellData(column, holder);
  if (hrefCellData) return hrefCellData;

  const rawValue = holder?.value;
  if (rawValue === null || rawValue === undefined) return "";

  if (Array.isArray(rawValue)) {
    return rawValue
      .map((value) => formatScalarValue(isArrayMember(value) ? value.value : value))
      .filter((value) => value.length > 0)
      .join(", ");
  }

  if (column?.type === "throwable" && isThrowableCellValue(rawValue)) {
    return formatThrowableValue(rawValue).join("\n");
  }

  return formatScalarValue(rawValue);
}

export function getTableCellTextClassName(column: Column | undefined): string {
  const classNames = [TABLE_CELL_TEXT_CLASS];

  if (column?.type === "multiLineString") {
    classNames.push(TABLE_CELL_MULTILINE_CLASS);
  }

  if (column?.type === "throwable") {
    classNames.push(TABLE_CELL_MULTILINE_CLASS, TABLE_CELL_THROWABLE_CLASS);
  }

  return classNames.join(" ");
}
