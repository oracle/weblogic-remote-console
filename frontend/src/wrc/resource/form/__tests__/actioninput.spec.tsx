/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/preact";

jest.mock("../../resource", () => ({
  UserContext: require("preact").createContext(null),
}));

jest.mock("../form", () => ({
  __esModule: true,
  default: () => <div data-testid="action-input-form" />,
}));

jest.mock("../formintro", () => ({
  FormIntro: () => <div />,
}));

jest.mock("../../shared/help", () => ({
  Help: () => <div />,
}));

jest.mock("../field-settings-dialog", () => ({
  __esModule: true,
  default: ({ open, formModel, fieldDescription, onClose, onApply }: any) =>
    open ? (
      <div data-testid="field-settings-dialog">
        <span data-testid="dialog-model">{formModel.id}</span>
        <span data-testid="dialog-field">{fieldDescription.name}</span>
        <button onClick={onApply}>Apply</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : <div />,
}));

jest.mock("wrc/shared/controller/notification-utils", () => ({
  broadcastErrorMessage: jest.fn(),
  broadcastMessageResponse: jest.fn(),
}));

jest.mock("wrc/shared/messages", () => ({
  isSuccessful: jest.fn(),
}));

jest.mock("ojL10n!wrc/shared/resources/nls/frontend", () => ({
  "wrc-common": { buttons: { done: { label: "Done" }, cancel: { label: "Cancel" } } },
  "wrc-form-toolbar": { icons: { help: { tooltip: "Help" } } },
}));

import { ActionInputForm } from "../actioninput";

describe("ActionInputForm Field Settings", () => {
  it("opens only for its model and applies changes through setModel", async () => {
    const clone = { id: "cloned-action-input-model" };
    const formModel = { id: "action-input-model", clone: jest.fn(() => clone) } as any;
    const otherModel = { id: "other-model" } as any;
    const setModel = jest.fn();

    render(<ActionInputForm formModel={formModel} setModel={setModel} />);

    document.dispatchEvent(new CustomEvent("open-field-settings", {
      detail: { fieldDescription: { name: "other", label: "Other" }, formModel: otherModel },
    }));
    expect(screen.queryByTestId("field-settings-dialog")).toBeNull();

    document.dispatchEvent(new CustomEvent("open-field-settings", {
      detail: { fieldDescription: { name: "userName", label: "Unlock Username" }, formModel },
    }));
    await waitFor(() => {
      expect(screen.getByTestId("dialog-model").textContent).toBe("action-input-model");
      expect(screen.getByTestId("dialog-field").textContent).toBe("userName");
    });

    fireEvent.click(screen.getByText("Apply"));
    expect(formModel.clone).toHaveBeenCalledTimes(1);
    expect(setModel).toHaveBeenCalledWith(clone);

    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByTestId("field-settings-dialog")).toBeNull();
    });
  });
});
