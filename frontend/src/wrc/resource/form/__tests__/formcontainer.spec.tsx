/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/preact";

jest.mock("../../resource", () => ({
  UserContext: require("preact").createContext(null),
}));

jest.mock("../../actions", () => ({
  Actions: ({ model, onActionSelected }: any) => (
    <button onClick={() => onActionSelected(model.getActions()[0])}>Run Action</button>
  ),
}));

jest.mock("../form", () => ({
  __esModule: true,
  default: ({ formModel }: any) => (
    <div data-testid="form-version">{String(formModel.version)}</div>
  ),
}));

jest.mock("../formintro", () => ({
  FormIntro: () => <div />,
}));

jest.mock("../formtoolbar", () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock("../field-settings-dialog", () => ({
  __esModule: true,
  default: ({ open, formModel }: any) =>
    open ? <div data-testid="field-settings-dialog">{String(formModel.version)}</div> : <div />,
}));

jest.mock("../tabs", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("../slicetable", () => ({
  __esModule: true,
  default: ({ onSelectionChanged }: any) => (
    <button
      onClick={() =>
        onSelectionChanged({ values: () => ["wlsoci1412ee_server_1"] })
      }
    >
      Select Monitoring Row
    </button>
  ),
}));

jest.mock("../../table/tableintro", () => ({
  TableIntro: () => <div />,
}));

jest.mock("../../table/table-toolbar", () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock("../../breadcrumbs", () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock("../../shared/help", () => ({
  Help: () => <div />,
}));

jest.mock("wrc/shared/refresh", () => ({
  subscribeToRefresh: jest.fn(() => () => undefined),
}));

jest.mock("wrc/shared/controller/notification-utils", () => ({
  broadcastErrorMessage: jest.fn(),
  broadcastMessageResponse: jest.fn(),
}));

jest.mock("wrc/shared/messages", () => ({
  isSuccessful: jest.fn((response) => response?.ok !== false),
}));

jest.mock("ojs/ojlogger", () => ({
  error: jest.fn(),
}));

jest.mock("ojL10n!wrc/shared/resources/nls/frontend", () => ({
  "wrc-header": { text: { appName: "WRC" } },
}));

jest.mock("../../../shared/model/formcontentmodel", () => {
  class FormContentModel {
    version: number;
    action: any;

    constructor(version = 0) {
      this.version = version;
    }

    clone() {
      return new FormContentModel(this.version);
    }

    getActions() {
      return this.action ? [this.action] : [];
    }

    getPageTitle() {
      return "Provider";
    }

    hasChanges() {
      return true;
    }

    stopPolling() {
      return undefined;
    }

    startPolling() {
      return undefined;
    }

    isPolling() {
      return false;
    }
  }

  return { FormContentModel };
});

jest.mock("../../../shared/model/tablecontentmodel", () => {
  class TableContentModel {
    action: any;

    getActions() {
      return this.action ? [this.action] : [];
    }

    getPageTitle() {
      return "Monitoring";
    }

    stopPolling() {
      return undefined;
    }

    startPolling() {
      return undefined;
    }

    isPolling() {
      return false;
    }
  }
  return { TableContentModel };
});

jest.mock("../../../shared/model/listcontentmodel", () => {
  class ListContentModel {}
  return { ListContentModel };
});

import { UserContext } from "../../resource";
import { FormContainer } from "../formcontainer";
import { FormContentModel } from "../../../shared/model/formcontentmodel";
import { TableContentModel } from "../../../shared/model/tablecontentmodel";
import { broadcastErrorMessage } from "wrc/shared/controller/notification-utils";

describe("FormContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("refreshes the rendered model before invoking a save-first action", async () => {
    const action = {
      name: "connect",
      label: "Connect",
      saveFirstLabel: "Save and Connect",
    };

    const formModel = new FormContentModel({} as any, {} as any) as any;
    formModel.version = 0;
    formModel.action = action;
    formModel.update = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ ok: true, messages: [] }),
    });
    formModel.clearChanges = jest.fn();
    formModel.refresh = jest.fn().mockImplementation(async () => {
      formModel.version = 1;
    });
    formModel.invokeAction = jest.fn().mockRejectedValue(new Error("connect failed"));
    formModel.clone = jest.fn(() => {
      const cloned = new FormContentModel({} as any, {} as any) as any;
      cloned.version = formModel.version;
      cloned.action = action;
      return cloned;
    });

    render(
      <UserContext.Provider value={{ rdj: "/api/test", showHelp: false }}>
        <FormContainer model={formModel} pageContext="main" />
      </UserContext.Provider>,
    );

    expect(screen.getByTestId("form-version").textContent).toBe("0");

    fireEvent.click(screen.getByText("Run Action"));

    await waitFor(() => {
      expect(formModel.update).toHaveBeenCalledTimes(1);
      expect(formModel.refresh).toHaveBeenCalledTimes(1);
      expect(formModel.clearChanges).toHaveBeenCalledTimes(1);
      expect(formModel.invokeAction).toHaveBeenCalledWith(action, undefined);
      expect(screen.getByTestId("form-version").textContent).toBe("1");
      expect(broadcastErrorMessage).toHaveBeenCalled();
    });
  });

  it("preserves a plain Monitoring row identifier when invoking an action", async () => {
    const action = {
      name: "shutdown",
      label: "Shutdown",
      rows: "one",
    };

    const tableModel = new TableContentModel({} as any, {} as any) as any;
    tableModel.action = action;
    tableModel.invokeAction = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ ok: true, messages: [] }),
    });

    render(
      <UserContext.Provider value={{ rdj: "/api/test", showHelp: false }}>
        <FormContainer model={tableModel} pageContext="main" />
      </UserContext.Provider>,
    );

    fireEvent.click(screen.getByText("Select Monitoring Row"));
    fireEvent.click(screen.getByText("Run Action"));

    await waitFor(() => {
      expect(tableModel.invokeAction).toHaveBeenCalledWith(
        action,
        ["wlsoci1412ee_server_1"],
      );
      expect(broadcastErrorMessage).not.toHaveBeenCalled();
    });
  });

  it("only opens Field Settings for its displayed form model", async () => {
    const formModel = new FormContentModel({} as any, {} as any) as any;
    formModel.version = 1;
    const actionInputModel = new FormContentModel({} as any, {} as any) as any;
    actionInputModel.version = 2;

    render(
      <UserContext.Provider value={{ rdj: "/api/test", showHelp: false }}>
        <FormContainer model={formModel} pageContext="main" />
      </UserContext.Provider>,
    );

    document.dispatchEvent(new CustomEvent("open-field-settings", {
      detail: { fieldDescription: { name: "Name", label: "Name" }, formModel: actionInputModel },
    }));
    expect(screen.queryByTestId("field-settings-dialog")).toBeNull();

    document.dispatchEvent(new CustomEvent("open-field-settings", {
      detail: { fieldDescription: { name: "Name", label: "Name" }, formModel },
    }));
    await waitFor(() => {
      expect(screen.getByTestId("field-settings-dialog").textContent).toBe("1");
    });
  });
});
