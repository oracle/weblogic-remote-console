/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { act, fireEvent, render, waitFor } from "@testing-library/preact";
import { ContentModelFactory } from "../../../shared/model/contentmodelfactory";
import { broadcastErrorMessage } from "wrc/shared/controller/notification-utils";
import { UserContext } from "../../resource";
import Tabs, { getSelectedSegmentForLevel, getSlicePath, loadSlice } from "../tabs";

jest.mock("oj-c/tab-bar", () => ({}));
jest.mock("oj-c/conveyor-belt", () => ({}));

jest.mock("../../../shared/model/contentmodelfactory", () => ({
  ContentModelFactory: jest.fn(),
}));

jest.mock("wrc/shared/controller/notification-utils", () => ({
  broadcastErrorMessage: jest.fn(),
}));

class TestTabBarElement extends HTMLElement {
  selection: string | undefined;
}

if (!customElements.get("oj-c-tab-bar")) {
  customElements.define("oj-c-tab-bar", TestTabBarElement);
}

describe("loadSlice", () => {
  it("replaces the model and clears loading after a successful slice load", async () => {
    const contentModel = { rdjUrl: "/api/test?slice=Messages" } as any;
    const modelFactory = { build: jest.fn().mockResolvedValue(contentModel) };
    const setLoading = jest.fn();
    const setModel = jest.fn();
    const onError = jest.fn();

    const loaded = await loadSlice({
      modelFactory,
      pageContext: "main",
      setLoading,
      setModel,
      slice: "Messages",
      onError,
    });

    expect(modelFactory.build).toHaveBeenCalledWith("Messages", "main");
    expect(loaded).toBe(true);
    expect(setModel).toHaveBeenCalledWith(contentModel);
    expect(onError).not.toHaveBeenCalled();
    expect(setLoading.mock.calls).toEqual([[true], [false]]);
  });

  it("keeps the existing model, reports the error, and clears loading after rejection", async () => {
    const error = new Error("Forbidden");
    const modelFactory = { build: jest.fn().mockRejectedValue(error) };
    const setLoading = jest.fn();
    const setModel = jest.fn();
    const onError = jest.fn();

    const loaded = await loadSlice({
      modelFactory,
      setLoading,
      setModel,
      slice: "Transactions",
      onError,
    });

    expect(setModel).not.toHaveBeenCalled();
    expect(loaded).toBe(false);
    expect(onError).toHaveBeenCalledWith(error);
    expect(setLoading.mock.calls).toEqual([[true], [false]]);
  });

  it("clears loading when the model factory returns no content model", async () => {
    const modelFactory = { build: jest.fn().mockResolvedValue(undefined) };
    const setLoading = jest.fn();
    const setModel = jest.fn();
    const onError = jest.fn();

    const loaded = await loadSlice({
      modelFactory,
      setLoading,
      setModel,
      slice: "Messages",
      onError,
    });

    expect(setModel).not.toHaveBeenCalled();
    expect(loaded).toBe(false);
    expect(onError).not.toHaveBeenCalled();
    expect(setLoading.mock.calls).toEqual([[true], [false]]);
  });
});

describe("slice selection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("derives the full successful slice path from the model URL", () => {
    expect(getSlicePath("/api/test?slice=Messages.View&context=main")).toBe("Messages.View");
  });

  it("selects the matching segment for each nested tab level", () => {
    expect(getSelectedSegmentForLevel(
      "Messages.View",
      "Messages.",
      [
        { name: "View", label: "View" },
        { name: "Criteria", label: "Criteria" },
      ],
    )).toBe("View");
  });

  it("renders page content without a tab bar when the PDJ has no slices", () => {
    const model = {
      rdjUrl: "/api/test?context=main",
      getSlices: () => undefined,
    } as any;
    const { container, getByText } = render(
      <UserContext.Provider value={{ rdj: model.rdjUrl, showHelp: false }}>
        <Tabs model={model} setModel={jest.fn()} setLoading={jest.fn()} pageContext="main">
          <div>Page without slices</div>
        </Tabs>
      </UserContext.Provider>,
    );

    expect(container.querySelector("oj-c-tab-bar")).toBeNull();
    expect(getByText("Page without slices")).toBeTruthy();
    expect(ContentModelFactory).not.toHaveBeenCalled();
  });

  it("uses the first PDJ slice at each level when the initial URL omits slice", () => {
    const model = {
      rdjUrl: "/api/test?context=main",
      getSlices: () => [
        {
          name: "Messages",
          label: "Messages",
          slices: [
            { name: "View", label: "View" },
            { name: "Criteria", label: "Criteria" },
          ],
        },
        { name: "General", label: "General" },
      ],
    } as any;
    const setLoading = jest.fn();
    const { container } = render(
      <UserContext.Provider value={{ rdj: model.rdjUrl, showHelp: false }}>
        <Tabs model={model} setModel={jest.fn()} setLoading={setLoading} pageContext="main">
          <div>Default slice content</div>
        </Tabs>
      </UserContext.Provider>,
    );
    const tabBars = Array.from(container.querySelectorAll("oj-c-tab-bar")) as TestTabBarElement[];

    expect(getSlicePath(model.rdjUrl)).toBe("");
    expect(tabBars.map((tabBar) => tabBar.selection)).toEqual(["Messages", "View"]);
    expect(ContentModelFactory).not.toHaveBeenCalled();
    expect(setLoading).not.toHaveBeenCalled();
    expect(model.rdjUrl).toBe("/api/test?context=main");
  });

  it("renders an explicit full nested slice without issuing or rewriting a request", () => {
    const model = {
      rdjUrl: "/api/test?context=main&slice=Messages.Criteria&key=history-1",
      getSlices: () => [
        { name: "General", label: "General" },
        {
          name: "Messages",
          label: "Messages",
          slices: [
            { name: "View", label: "View" },
            { name: "Criteria", label: "Criteria" },
          ],
        },
      ],
    } as any;
    const { container } = render(
      <UserContext.Provider value={{ rdj: model.rdjUrl, showHelp: false }}>
        <Tabs model={model} setModel={jest.fn()} setLoading={jest.fn()} pageContext="main">
          <div>Criteria content</div>
        </Tabs>
      </UserContext.Provider>,
    );
    const tabBars = Array.from(container.querySelectorAll("oj-c-tab-bar")) as TestTabBarElement[];

    expect(tabBars.map((tabBar) => tabBar.selection)).toEqual(["Messages", "Criteria"]);
    expect(ContentModelFactory).not.toHaveBeenCalled();
    expect(model.rdjUrl).toBe("/api/test?context=main&slice=Messages.Criteria&key=history-1");
  });

  it("follows back and forward models with full nested slices without rewriting them", () => {
    const slices = [
      {
        name: "Messages",
        label: "Messages",
        slices: [
          { name: "View", label: "View" },
          { name: "Criteria", label: "Criteria" },
        ],
      },
      {
        name: "Protocols",
        label: "Protocols",
        slices: [
          { name: "General", label: "General" },
          { name: "Http", label: "HTTP" },
        ],
      },
    ];
    const backModel = {
      rdjUrl: "/api/test?context=main&slice=Messages.Criteria&key=history-back",
      getSlices: () => slices,
    } as any;
    const forwardModel = {
      rdjUrl: "/api/test?context=main&slice=Protocols.Http&key=history-forward",
      getSlices: () => slices,
    } as any;
    const setModel = jest.fn();
    const setLoading = jest.fn();
    const renderTabs = (model: any) => (
      <UserContext.Provider value={{ rdj: model.rdjUrl, showHelp: false }}>
        <Tabs model={model} setModel={setModel} setLoading={setLoading} pageContext="main">
          <div>Recorded page content</div>
        </Tabs>
      </UserContext.Provider>
    );
    const rendered = render(renderTabs(backModel));
    const getSelections = () =>
      (Array.from(rendered.container.querySelectorAll("oj-c-tab-bar")) as TestTabBarElement[])
        .map((tabBar) => tabBar.selection);

    expect(getSelections()).toEqual(["Messages", "Criteria"]);

    rendered.rerender(renderTabs(forwardModel));
    expect(getSelections()).toEqual(["Protocols", "Http"]);

    rendered.rerender(renderTabs(backModel));
    expect(getSelections()).toEqual(["Messages", "Criteria"]);

    expect(ContentModelFactory).not.toHaveBeenCalled();
    expect(setModel).not.toHaveBeenCalled();
    expect(backModel.rdjUrl).toBe("/api/test?context=main&slice=Messages.Criteria&key=history-back");
    expect(forwardModel.rdjUrl).toBe("/api/test?context=main&slice=Protocols.Http&key=history-forward");
  });

  it("restores the previously successful tab after a rejected selection", async () => {
    const error = new Error("Access to 'Messages' is forbidden.");
    let rejectBuild: (reason: Error) => void = () => undefined;
    const build = jest.fn().mockImplementation(() => new Promise((_resolve, reject) => {
      rejectBuild = reject;
    }));
    (ContentModelFactory as jest.Mock).mockImplementation(() => ({ build }));

    const model = {
      rdjUrl: "/api/test?slice=General&context=main",
      getSlices: () => [
        { name: "General", label: "General" },
        { name: "Messages", label: "Messages" },
      ],
    } as any;
    const setModel = jest.fn();
    const setLoading = jest.fn();
    const { container } = render(
      <UserContext.Provider value={{ rdj: model.rdjUrl, showHelp: false }}>
        <Tabs model={model} setModel={setModel} setLoading={setLoading} pageContext="main">
          <div>General content</div>
        </Tabs>
      </UserContext.Provider>,
    );
    const tabBar = container.querySelector("oj-c-tab-bar") as any;

    expect(tabBar.selection).toBe("General");

    fireEvent(
      tabBar,
      new CustomEvent("ojSelectionAction", {
        detail: { previousValue: "General", value: "General" },
      }),
    );
    expect(build).not.toHaveBeenCalled();

    fireEvent(
      tabBar,
      new CustomEvent("ojSelectionAction", {
        detail: { previousValue: "General", value: "Messages" },
      }),
    );

    await waitFor(() => expect(tabBar.selection).toBe("Messages"));

    await act(async () => {
      rejectBuild(error);
      await Promise.resolve();
    });

    await waitFor(() => expect(tabBar.selection).toBe("General"));
    expect(build).toHaveBeenCalledWith("Messages", "main");
    expect(setModel).not.toHaveBeenCalled();
    expect(broadcastErrorMessage).toHaveBeenCalledWith(expect.anything(), error);
    expect(setLoading.mock.calls).toEqual([[true], [false]]);
  });
});
