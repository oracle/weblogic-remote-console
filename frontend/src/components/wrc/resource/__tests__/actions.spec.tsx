/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { render } from "@testing-library/preact";
import { Model } from "wrc/shared/model/common";
import { Action, PDJ } from "wrc/shared/typedefs/pdj";
import { RDJ } from "wrc/shared/typedefs/rdj";
import { Actions } from "../actions";
import Context = require("ojs/ojcontext");

jest.mock("wrc/shared/model/common", () => {
  const fakeActions: Action[] = [
    {
      name: "action1",
      label: "action #1",
    },
    {
      name: "action2",
      label: "action #2",
    },
    {
      name: "action3",
      label: "action #3",
    },
  ];

  const a = { getActions: jest.fn().mockReturnValue(fakeActions) };
  return { Model: jest.fn(() => a) };
});

describe("Actions component", () => {
  it("should only enable actions marked as enabled", async () => {
    const model = new Model({} as unknown as RDJ, {} as unknown as PDJ);

    const content = render(
      <div data-oj-binding-provider="preact">
        <Actions
          model={model}
          enabledActions={["action1", "action3"]}
          onActionSelected={() => {}}
          onActionPolling={() => {}}
        ></Actions>
      </div>,
    );

    await Context.getContext(content.container).getBusyContext().whenReady();

    // action2 is disabled, everything else is enabled per the render(...)
    const btn1 = content.getAllByTestId("action1")[0] as HTMLElement;
    const btn2 = content.getAllByTestId("action2")[0] as HTMLElement;
    const btn3 = content.getAllByTestId("action3")[0] as HTMLElement;

    // Custom element may not reflect disabled as an HTML attribute; check property instead
    expect((btn1 as any).disabled).toBe(false);
    expect((btn2 as any).disabled).toBe(true);
    expect((btn3 as any).disabled).toBe(false);
  });
});
