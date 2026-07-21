/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { fireEvent, render, screen } from "@testing-library/preact";

jest.mock("../../resource", () => ({
  UserContext: require("preact").createContext(null),
}));

jest.mock("../../../multiselect", () => ({
  __esModule: true,
  default: jest.fn((props: any) => (
    <button
      data-testid="mock-multiselect"
      onClick={() =>
        props.changeHandler({
          available: [{ key: "Type", label: "Type" }],
          chosen: [
            { key: "Name", label: "Name" },
            { key: "State", label: "State" },
          ],
        })
      }
    />
  )),
}));

jest.mock("../../shared/toolbar-render", () => ({
  buildToolbarButtons: () => null,
}));

jest.mock("wrc/shared/weighted-sort", () => ({
  WeightedSort: ({ children }: any) => <>{children}</>,
}));

jest.mock("../../shared/toolbaricons", () => ({
  __esModule: true,
  default: () => <div data-testid="toolbar-icons" />,
}));

jest.mock("../../action-redwood-map", () => ({
  ActionRedwoodMap: {},
}));

jest.mock("wrc/shared/controller/notification-utils", () => ({
  broadcastErrorMessage: jest.fn(),
}));

jest.mock("ojs/ojlogger", () => ({
  info: jest.fn(),
  log: jest.fn(),
}));

jest.mock("wrc/shared/url", () => ({
  requireAsset: jest.fn(() => "table-customizer-icon.png"),
}));

jest.mock("ojL10n!wrc/shared/resources/nls/frontend", () => ({
  "wrc-table-toolbar": {
    buttons: {
      customize: { label: "Customize" },
      new: { label: "New" },
    },
  },
  "wrc-common": {
    buttons: {
      apply: { label: "Apply" },
      cancel: { label: "Cancel" },
      reset: { label: "Reset" },
      write: { label: "Write" },
    },
  },
}));

import MultiSelect from "../../../multiselect";
import TableToolbar from "../table-toolbar";

describe("TableToolbar customizer", () => {
  const getLastMultiSelectProps = () => {
    const calls = (MultiSelect as jest.Mock).mock.calls;
    return calls[calls.length - 1]?.[0];
  };

  it("renders moved columns in the customizer before the user applies them", () => {
    const nameColumn = { name: "Name", label: "Name" };
    const stateColumn = { name: "State", label: "State" };
    const typeColumn = { name: "Type", label: "Type" };
    const tableContent: any = {
      canCreate: jest.fn(() => false),
      canCreateDashboard: jest.fn(() => false),
      clone: jest.fn(() => tableContent),
      getColumnsCustomizedForDisplay: jest.fn(() => ({
        displayed: [nameColumn],
        hidden: [stateColumn, typeColumn],
      })),
      getCreateForm: jest.fn(() => undefined),
      getDashboardCreateForm: jest.fn(() => undefined),
      getDisplayedColumns: jest.fn(() => [nameColumn]),
      getHiddenColumns: jest.fn(() => [stateColumn, typeColumn]),
      hasColumnDisplayCustomizations: jest.fn(() => false),
      isPolling: jest.fn(() => false),
      refresh: jest.fn(),
      saveColumnsForDisplay: jest.fn(),
      saveResetColumnsForDisplay: jest.fn(),
      stopPolling: jest.fn(),
    };

    render(
      <TableToolbar
        tableContent={tableContent}
        setTableContent={jest.fn()}
        showHelp={false}
        onHelpClick={jest.fn()}
        pageContext="main"
      />,
    );

    fireEvent.click(screen.getByText("Customize"));

    expect(getLastMultiSelectProps()).toEqual(
      expect.objectContaining({
        available: [
          { key: "State", label: "State" },
          { key: "Type", label: "Type" },
        ],
        chosen: [{ key: "Name", label: "Name" }],
      }),
    );

    fireEvent.click(screen.getByTestId("mock-multiselect"));

    expect(getLastMultiSelectProps()).toEqual(
      expect.objectContaining({
        available: [{ key: "Type", label: "Type" }],
        chosen: [
          { key: "Name", label: "Name" },
          { key: "State", label: "State" },
        ],
      }),
    );
    expect(tableContent.saveColumnsForDisplay).not.toHaveBeenCalled();
  });
});
