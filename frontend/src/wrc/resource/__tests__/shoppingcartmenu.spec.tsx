/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { act } from "preact/test-utils";
import { render } from "@testing-library/preact";

jest.mock("../resource", () => ({
  UserContext: require("preact").createContext(null),
  Resource: () => <div data-testid="shoppingcart-resource" />,
}));

jest.mock("../../display/dialog", () => ({
  Dialog: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock("wrc/shared/model/transport", () => ({
  _post: jest.fn(),
  getDataComponent: jest.fn(),
}));

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

describe("ShoppingCartMenu", () => {
  it("hides the launcher when the shopping cart state is off", () => {
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

    act(() => {
      subscribers[0]({ shoppingcart: { state: "off" } });
    });

    expect(container.querySelector("#shoppingCartMenuLauncher")).toBeNull();
  });
});
