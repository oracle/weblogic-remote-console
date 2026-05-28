/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Column } from "../../../shared/typedefs/pdj";
import { PropertyValueHolder } from "../../../shared/typedefs/rdj";
import {
  buildTableCellValue,
  getTableCellTextClassName,
  TABLE_CELL_MULTILINE_CLASS,
  TABLE_CELL_THROWABLE_CLASS,
} from "../table-cell";

describe("table cell helper", () => {
  it("should format throwable values as an indented message chain", () => {
    const column = { name: "TaskError", type: "throwable", label: "Error" } as Column;
    const holder = {
      value: {
        message: "Top level failure",
        cause: {
          message: "Nested root cause",
        },
      },
    } as PropertyValueHolder;

    expect(buildTableCellValue(column, holder)).toBe(
      "Top level failure\n  Nested root cause",
    );
  });

  it("should preserve multiline strings for table rendering", () => {
    const column = { name: "Notes", type: "multiLineString", label: "Notes" } as Column;
    const holder = { value: "line 1\nline 2" } as PropertyValueHolder;

    expect(buildTableCellValue(column, holder)).toBe("line 1\nline 2");
  });

  it("should add multiline styling for multiline string columns", () => {
    const column = { name: "Notes", type: "multiLineString", label: "Notes" } as Column;

    expect(getTableCellTextClassName(column)).toContain(TABLE_CELL_MULTILINE_CLASS);
  });

  it("should add throwable styling for throwable columns", () => {
    const column = { name: "TaskError", type: "throwable", label: "Error" } as Column;
    const className = getTableCellTextClassName(column);

    expect(className).toContain(TABLE_CELL_MULTILINE_CLASS);
    expect(className).toContain(TABLE_CELL_THROWABLE_CLASS);
  });
});
