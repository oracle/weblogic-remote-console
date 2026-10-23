/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { act } from "preact/test-utils";
import { fireEvent, render } from "@testing-library/preact";

jest.mock("../resource", () => ({
  UserContext: require("preact").createContext(null),
  Resource: ({ rdj }: { rdj: string }) => <div data-testid="shoppingcart-resource" data-rdj={rdj} />,
}));

jest.mock("../../display/dialog", () => ({
  Dialog: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock("wrc/shared/model/transport", () => ({
  _post: jest.fn(),
  getDataComponent: jest.fn(),
  parseResponseJson: jest.fn((response) => response.json()),
}));

jest.mock("wrc/shared/controller/notification-utils", () =>
  jest.requireActual("../../shared/controller/notification-utils"),
);

jest.mock("wrc/shared/messages", () =>
  jest.requireActual("../../shared/messages"),
);

jest.mock("wrc/shared/refresh", () => ({
  emitRefresh: jest.fn(),
}));

jest.mock("ojs/ojlogger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
}));

jest.mock("ojs/ojcontext", () => ({
  getContext: jest.fn(() => ({
    getBusyContext: () => ({
      whenReady: jest.fn(() => Promise.resolve()),
    }),
  })),
}));

jest.mock("ojs/ojdialog", () => ({
  ojDialog: class {},
}));

jest.mock("ojs/ojvcomponent", () => ({
  registerCustomElement: (_name: string, component: any) => component,
}));

jest.mock("oj-c/button", () => ({}));
jest.mock("ojs/ojmenu", () => ({}));

jest.mock("ojL10n!wrc/shared/resources/nls/frontend", () => ({
  "wrc-content-area-header": {
    icons: {
      shoppingcart: {
        tooltip: "Shopping cart",
      },
    },
    menu: {
      shoppingcart: {
        view: { label: "View Changes..." },
        discard: { label: "Discard Changes" },
        commit: { label: "Commit Changes" },
      },
    },
  },
  "wrc-ancillary-content": {
    tabstrip: {
      tabs: {
        shoppingcart: {
          label: "Shopping Cart",
        },
      },
    },
  },
}));

import { UserContext } from "../resource";
import ShoppingCartMenu from "../shoppingcartmenu";
import { _post, getDataComponent, parseResponseJson } from "wrc/shared/model/transport";
import { emitRefresh } from "wrc/shared/refresh";

describe("ShoppingCartMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderCart = () => {
    const broadcastMessage = jest.fn();
    const subscribers: Array<(event: any) => void> = [];
    const { container } = render(
      <UserContext.Provider
        value={{
          rdj: "/api/test",
          showHelp: false,
          databus: {
            subscribe: (callback: (event: any) => void) => {
              subscribers.push(callback);
              return { detach: jest.fn() };
            },
          } as any,
          context: { broadcastMessage } as any,
        }}
      >
        <ShoppingCartMenu />
      </UserContext.Provider>,
    );
    act(() => subscribers[0]({ shoppingcart: { state: "full" } }));
    return { container, broadcastMessage };
  };

  const selectAction = async (container: Element, selectedValue: string) => {
    await act(async () => {
      fireEvent(container.querySelector("#shoppingCartMenu")!, new CustomEvent(
        "ojMenuAction", { detail: { selectedValue }, bubbles: true },
      ));
      // Let the request, response parsing, and notification promise chain finish.
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };

  it.each([200, 400])("displays commit validation errors from HTTP %s without viewing changes", async (status) => {
    const messages = [
      { severity: "error", message: "Oracle NoSQL resource 'test3' property 'jnosql.document.database' is required" },
      { severity: "error", message: "Failed to activate the changes." },
    ];
    const response = {
      status,
      ok: status === 200,
      json: jest.fn().mockResolvedValue({
        messages,
        statusData: { shoppingcart: { state: "full", resourceData: "/api/shoppingcart" } },
      }),
    };
    jest.mocked(_post).mockResolvedValue(response as any);
    const { container, broadcastMessage } = renderCart();

    await selectAction(container, "commit");

    expect(_post).toHaveBeenCalledWith("/api/-current-/edit/changeManager/commitChanges", "{}");
    expect(parseResponseJson).toHaveBeenCalledWith(response, "/api/-current-/edit/changeManager/commitChanges");
    expect(broadcastMessage).toHaveBeenCalledWith(expect.objectContaining({
      severity: "error",
      detail: `${messages[0].message}. ${messages[1].message}`,
    }));
    expect(container.querySelector("span.oj-ux-ico-cart-full")).not.toBeNull();
    expect(container.querySelector('[data-testid="shoppingcart-resource"]')?.getAttribute("data-rdj")).toBe("");
    expect(getDataComponent).not.toHaveBeenCalled();
    expect(emitRefresh).not.toHaveBeenCalled();
  });

  it.each(["commit", "discard"])("displays successful %s messages and updates cart status", async (action) => {
    jest.mocked(_post).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ messages: [{ severity: "info", message: "Changes processed." }] }),
    } as any);
    const { container, broadcastMessage } = renderCart();

    await selectAction(container, action);

    expect(_post).toHaveBeenCalledWith(`/api/-current-/edit/changeManager/${action}Changes`, "{}");
    expect(broadcastMessage).toHaveBeenCalledWith(expect.objectContaining({ severity: "info", detail: "Changes processed." }));
    expect(getDataComponent).toHaveBeenCalledWith("/api/-current-/edit/changeManager");
    if (action === "discard") {
      expect(emitRefresh).toHaveBeenCalledWith({ scope: { content: true, navtree: true } });
    } else {
      expect(emitRefresh).not.toHaveBeenCalled();
    }
  });

  it.each(["commit", "discard"])("displays %s request failures", async (action) => {
    jest.mocked(_post).mockRejectedValue(new Error("Connection lost"));
    const { container, broadcastMessage } = renderCart();

    await selectAction(container, action);

    expect(broadcastMessage).toHaveBeenCalledWith(expect.objectContaining({ severity: "error", detail: "Connection lost" }));
    expect(getDataComponent).not.toHaveBeenCalled();
    expect(emitRefresh).not.toHaveBeenCalled();
  });

  it("displays malformed response errors", async () => {
    jest.mocked(_post).mockResolvedValue({
      json: jest.fn().mockRejectedValue(new SyntaxError("Invalid JSON")),
    } as any);
    const { container, broadcastMessage } = renderCart();

    await selectAction(container, "commit");

    expect(broadcastMessage).toHaveBeenCalledWith(expect.objectContaining({ severity: "error", detail: "Invalid JSON" }));
  });

  it("updates the launcher and icon for the shopping cart state", () => {
    const subscribers: Array<(event: any) => void> = [];
    const databus = {
      subscribe: (callback: (event: any) => void) => {
        subscribers.push(callback);
        return { detach: jest.fn() };
      },
    };

    const { container } = render(
      <UserContext.Provider
        value={{
          rdj: "/api/test",
          showHelp: false,
          databus: databus as any,
          context: {},
        }}
      >
        <ShoppingCartMenu />
      </UserContext.Provider>
    );

    expect(container.querySelector("#shoppingCartMenuLauncher")).toBeNull();

    act(() => {
      subscribers[0]({ shoppingcart: { state: "empty" } });
    });

    expect(container.querySelector("#shoppingCartMenuLauncher")).not.toBeNull();
    expect(
      container.querySelector("span.oj-ux-ico-cart-empty"),
    ).not.toBeNull();

    act(() => {
      subscribers[0]({ shoppingcart: { state: "full" } });
    });

    expect(
      container.querySelector("span.oj-ux-ico-cart-full"),
    ).not.toBeNull();

    act(() => {
      subscribers[0]({ shoppingcart: { state: "off" } });
    });

    expect(container.querySelector("#shoppingCartMenuLauncher")).toBeNull();
  });
});
