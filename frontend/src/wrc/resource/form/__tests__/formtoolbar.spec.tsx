/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { fireEvent, render, screen } from "@testing-library/preact";

jest.mock("../../resource", () => ({
  UserContext: require("preact").createContext(null),
}));

jest.mock("../../shared/toolbar-render", () => ({
  buildToolbarButtons: (buttons: Record<string, any>) =>
    Object.entries(buttons).map(([key, cfg]) =>
      cfg.isVisible() ? (
        <button
          key={key}
          data-testid={key}
          disabled={!cfg.isEnabled()}
          onClick={() => cfg.action({ preventDefault: jest.fn() })}
        >
          {cfg.label || key}
        </button>
      ) : null
    ),
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

jest.mock("wrc/shared/model/transport", () => ({
  doAction: jest.fn(),
}));

jest.mock("wrc/shared/controller/notification-utils", () => ({
  broadcastErrorMessage: jest.fn(),
  broadcastMessageResponse: jest.fn(),
}));

jest.mock("wrc/shared/messages", () => ({
  isSuccessful: jest.fn(() => true),
}));

jest.mock("ojs/ojlogger", () => ({
  info: jest.fn(),
}));

jest.mock("ojL10n!wrc/shared/resources/nls/frontend", () => ({
  "wrc-form-toolbar": {
    buttons: {
      cancel: { label: "Cancel" },
      new: { label: "Create" },
      delete: { label: "Delete" },
      save: { label: "Save" },
      savenow: { label: "Save Now" },
      back: { label: "Back" },
      forward: { label: "Forward" },
    },
    icons: {
      help: { tooltip: "Help" },
    },
  },
}));

import { UserContext } from "../../resource";
import FormToolbar from "../formtoolbar";

describe("FormToolbar", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("navigates back on cancel for main-window create forms", () => {
    const navigateToAbsolutePath = jest.fn();
    const databus = {
      subscribe: (callback: (event: any) => void) => {
        callback({
          contexts: {
            main: {
              "back-resource-data": "/api/configuration/data/Domain/Servers",
            },
          },
        });
        return { detach: jest.fn() };
      },
    };
    const formModel: any = {
      clear: jest.fn(),
      clone: jest.fn(() => ({ cloned: true })),
      hasChanges: jest.fn(() => true),
      isCreate: jest.fn(() => true),
      isCreatableOptionalSingleton: jest.fn(() => false),
      isDataMissing: jest.fn(() => false),
      getSelfResourceData: jest.fn(() => "/api/configuration/data/Domain/Servers/create"),
      getBreadcrumbs: jest.fn(() => []),
      canSaveToCart: false,
      isFormReadOnly: jest.fn(() => false),
      isActionInput: jest.fn(() => false),
      canSaveNow: false,
      canCreateDashboard: jest.fn(() => false),
      getDashboardCreateForm: jest.fn(() => undefined),
      isPolling: jest.fn(() => false),
      stopPolling: jest.fn(),
      refresh: jest.fn(),
    };
    const setModel = jest.fn();

    render(
      <UserContext.Provider
        value={{
          rdj: "/api/test",
          showHelp: false,
          databus: databus as any,
          context: { routerController: { navigateToAbsolutePath, selectRoot: jest.fn() } },
        }}
      >
        <FormToolbar
          formModel={formModel}
          setModel={setModel}
          showHelp={false}
          onHelpClick={jest.fn()}
          pageContext="main"
        />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByTestId("cancel"));

    expect(formModel.clear).toHaveBeenCalledTimes(1);
    expect(formModel.clone).toHaveBeenCalledTimes(1);
    expect(setModel).toHaveBeenCalledWith({ cloned: true });
    expect(navigateToAbsolutePath).toHaveBeenCalledWith(
      "/api/configuration/data/Domain/Servers"
    );
  });

  it("retains the last back target when later status events omit it", () => {
    const navigateToAbsolutePath = jest.fn();
    const databus = {
      subscribe: (callback: (event: any) => void) => {
        callback({
          contexts: {
            main: {
              "back-resource-data": "/api/configuration/data/Domain/Servers",
            },
          },
        });
        callback({
          contexts: {
            main: {},
          },
        });
        return { detach: jest.fn() };
      },
    };
    const formModel: any = {
      clear: jest.fn(),
      clone: jest.fn(() => ({ cloned: true })),
      hasChanges: jest.fn(() => true),
      isCreate: jest.fn(() => true),
      isCreatableOptionalSingleton: jest.fn(() => false),
      isDataMissing: jest.fn(() => false),
      getSelfResourceData: jest.fn(() => "/api/configuration/data/Domain/Servers/create"),
      getBreadcrumbs: jest.fn(() => []),
      canSaveToCart: false,
      isFormReadOnly: jest.fn(() => false),
      isActionInput: jest.fn(() => false),
      canSaveNow: false,
      canCreateDashboard: jest.fn(() => false),
      getDashboardCreateForm: jest.fn(() => undefined),
      isPolling: jest.fn(() => false),
      stopPolling: jest.fn(),
      refresh: jest.fn(),
    };

    render(
      <UserContext.Provider
        value={{
          rdj: "/api/test",
          showHelp: false,
          databus: databus as any,
          context: { routerController: { navigateToAbsolutePath, selectRoot: jest.fn() } },
        }}
      >
        <FormToolbar
          formModel={formModel}
          setModel={jest.fn()}
          showHelp={false}
          onHelpClick={jest.fn()}
          pageContext="main"
        />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByTestId("cancel"));

    expect(navigateToAbsolutePath).toHaveBeenCalledWith(
      "/api/configuration/data/Domain/Servers"
    );
  });

  it("falls back to the parent breadcrumb when no back target exists for a main-window create form", () => {
    const navigateToAbsolutePath = jest.fn();
    const formModel: any = {
      clear: jest.fn(),
      clone: jest.fn(() => ({ cloned: true })),
      hasChanges: jest.fn(() => true),
      isCreate: jest.fn(() => true),
      isCreatableOptionalSingleton: jest.fn(() => false),
      isDataMissing: jest.fn(() => false),
      getSelfResourceData: jest.fn(() => "/api/configuration/data/Domain/Servers/create"),
      getBreadcrumbs: jest.fn(() => [
        { resourceData: "/api/configuration/data/Domain" },
        { resourceData: "/api/configuration/data/Domain/Servers" },
        { resourceData: "/api/configuration/data/Domain/Servers/create" },
      ]),
      canSaveToCart: false,
      isFormReadOnly: jest.fn(() => false),
      isActionInput: jest.fn(() => false),
      canSaveNow: false,
      canCreateDashboard: jest.fn(() => false),
      getDashboardCreateForm: jest.fn(() => undefined),
      isPolling: jest.fn(() => false),
      stopPolling: jest.fn(),
      refresh: jest.fn(),
    };

    render(
      <UserContext.Provider
        value={{
          rdj: "/api/test",
          showHelp: false,
          context: { routerController: { navigateToAbsolutePath, selectRoot: jest.fn() } },
        }}
      >
        <FormToolbar
          formModel={formModel}
          setModel={jest.fn()}
          showHelp={false}
          onHelpClick={jest.fn()}
          pageContext="main"
        />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByTestId("cancel"));

    expect(navigateToAbsolutePath).toHaveBeenCalledWith(
      "/api/configuration/data/Domain/Servers"
    );
  });

  it("closes modal create forms on cancel by delegating to dialog navigation", () => {
    const navigateToAbsolutePath = jest.fn();
    const formModel: any = {
      clear: jest.fn(),
      clone: jest.fn(() => ({ cloned: true })),
      hasChanges: jest.fn(() => true),
      isCreate: jest.fn(() => true),
      isCreatableOptionalSingleton: jest.fn(() => false),
      isDataMissing: jest.fn(() => false),
      getSelfResourceData: jest.fn(() => "/api/configuration/data/Domain/Clusters/create"),
      getBreadcrumbs: jest.fn(() => []),
      canSaveToCart: false,
      isFormReadOnly: jest.fn(() => false),
      isActionInput: jest.fn(() => false),
      canSaveNow: false,
      canCreateDashboard: jest.fn(() => false),
      getDashboardCreateForm: jest.fn(() => undefined),
      isPolling: jest.fn(() => false),
      stopPolling: jest.fn(),
      refresh: jest.fn(),
    };

    render(
      <UserContext.Provider
        value={{
          rdj: "/api/test",
          showHelp: false,
          context: { routerController: { navigateToAbsolutePath, selectRoot: jest.fn() } },
        }}
      >
        <FormToolbar
          formModel={formModel}
          setModel={jest.fn()}
          showHelp={false}
          onHelpClick={jest.fn()}
        />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByTestId("cancel"));

    expect(navigateToAbsolutePath).toHaveBeenCalledWith(
      "/api/configuration/data/Domain/Clusters/create"
    );
  });
});
