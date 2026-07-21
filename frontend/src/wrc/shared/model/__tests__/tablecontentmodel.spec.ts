/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Column, PDJ } from "wrc/shared/typedefs/pdj";
import { RDJ } from "wrc/shared/typedefs/rdj";
import { TableContentModel } from "../tablecontentmodel";
import { _post, getData } from "../transport";

jest.mock("../transport", () => ({
  _post: jest.fn(),
  getData: jest.fn(),
}));

const nameColumn: Column = { name: "Name", label: "Name" };
const typeColumn: Column = { name: "Type", label: "Type" };
const stateColumn: Column = { name: "State", label: "State" };
const runtimeColumn: Column = { name: "Runtime", label: "Runtime" };

const createRdj = (overrides: Partial<RDJ> = {}): RDJ => ({
  navigation: "nav",
  self: { resourceData: "self" },
  breadCrumbs: [],
  links: [],
  changeManager: {} as any,
  createForm: { resourceData: "createForm" },
  pageDescription: "pageDescription",
  data: [],
  ...overrides,
});

const createTablePdj = (): PDJ => ({
  introductionHTML: "intro",
  helpPageTitle: "title",
  helpTopics: [],
  table: {
    displayedColumns: [nameColumn, typeColumn],
    hiddenColumns: [stateColumn],
    requiresRowSelection: false,
    rowSelectionProperty: "Name",
    navigationProperty: "Name",
    defaultSortProperty: "Name",
  },
});

const createSliceTablePdj = (): PDJ => ({
  introductionHTML: "intro",
  helpPageTitle: "title",
  helpTopics: [],
  sliceTable: {
    displayedColumns: [nameColumn],
    hiddenColumns: [runtimeColumn],
    requiresRowSelection: false,
    rowSelectionProperty: "Name",
    navigationProperty: "Name",
    readOnly: false,
  },
});

describe("TableContentModel table customizations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (_post as jest.Mock).mockResolvedValue({ ok: true });
  });

  it("uses displayedColumns from the RDJ to restore the selected column order", () => {
    const model = new TableContentModel(
      createRdj({ displayedColumns: ["State", "Name"] }),
      createTablePdj(),
    );

    const columns = model.getColumnsCustomizedForDisplay();

    expect(columns.displayed?.map((column) => column.name)).toEqual([
      "State",
      "Name",
    ]);
    expect(columns.hidden?.map((column) => column.name)).toEqual(["Type"]);
    expect(model.hasColumnDisplayCustomizations()).toBe(true);
  });

  it("uses slice table hidden columns when customizations include slice columns", () => {
    const model = new TableContentModel(
      createRdj({ displayedColumns: ["Runtime", "Name"] }),
      createSliceTablePdj(),
    );

    const columns = model.getColumnsCustomizedForDisplay();

    expect(columns.displayed?.map((column) => column.name)).toEqual([
      "Runtime",
      "Name",
    ]);
    expect(columns.hidden).toEqual([]);
  });

  it("posts displayed column names before applying a customization locally", async () => {
    const model = new TableContentModel(
      createRdj({ tableCustomizer: "/api/test?action=customizeTable" }),
      createTablePdj(),
    );

    await model.saveColumnsForDisplay([stateColumn, nameColumn]);

    expect(_post).toHaveBeenCalledWith(
      "/api/test?action=customizeTable",
      JSON.stringify({ displayedColumns: ["State", "Name"] }),
    );
    expect(
      model
        .getColumnsCustomizedForDisplay()
        .displayed?.map((column) => column.name),
    ).toEqual(["State", "Name"]);
  });

  it("posts an empty payload when resetting a persisted customization", async () => {
    const model = new TableContentModel(
      createRdj({
        displayedColumns: ["State", "Name"],
        tableCustomizer: "/api/test?action=customizeTable",
      }),
      createTablePdj(),
    );

    await model.saveResetColumnsForDisplay();

    expect(_post).toHaveBeenCalledWith(
      "/api/test?action=customizeTable",
      JSON.stringify({}),
    );
    expect(model.hasColumnDisplayCustomizations()).toBe(false);
    expect(
      model
        .getColumnsCustomizedForDisplay()
        .displayed?.map((column) => column.name),
    ).toEqual(["Name", "Type"]);
  });

  it("keeps local customization behavior when the RDJ has no table customizer URL", async () => {
    const model = new TableContentModel(createRdj(), createTablePdj());

    await model.saveColumnsForDisplay([stateColumn, nameColumn]);

    expect(_post).not.toHaveBeenCalled();
    expect(
      model
        .getColumnsCustomizedForDisplay()
        .displayed?.map((column) => column.name),
    ).toEqual(["State", "Name"]);
  });

  it("does not apply a customization locally when the backend save fails", async () => {
    (_post as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });
    const model = new TableContentModel(
      createRdj({ tableCustomizer: "/api/test?action=customizeTable" }),
      createTablePdj(),
    );

    await expect(
      model.saveColumnsForDisplay([stateColumn, nameColumn]),
    ).rejects.toThrow("HTTP 500 Server Error");

    expect(
      model
        .getColumnsCustomizedForDisplay()
        .displayed?.map((column) => column.name),
    ).toEqual(["Name", "Type"]);
  });

  it("syncs refreshed RDJ displayedColumns into the model", async () => {
    const model = new TableContentModel(createRdj(), createTablePdj());
    model.rdjUrl = "/api/test";
    (getData as jest.Mock).mockResolvedValue([
      createRdj({ displayedColumns: ["State", "Name"] }),
      undefined,
    ]);

    await model.refresh();

    expect(getData).toHaveBeenCalledWith("/api/test?reload=true", undefined);
    expect(
      model
        .getColumnsCustomizedForDisplay()
        .displayed?.map((column) => column.name),
    ).toEqual(["State", "Name"]);
  });
});
