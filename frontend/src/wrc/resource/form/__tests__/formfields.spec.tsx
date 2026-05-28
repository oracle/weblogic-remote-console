/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { fireEvent, render, waitFor } from "@testing-library/preact";
import { h } from "preact";
import { ojTable } from "ojs/ojtable";
import { FormContentModel } from "wrc/shared/model/formcontentmodel";
import { PDJ, Property } from "wrc/shared/typedefs/pdj";
import { RDJ } from "wrc/shared/typedefs/rdj";
import Form from "../form";
import FieldSettingsDialog from "../field-settings-dialog";
import { getFileSelectorForNewFile } from "../formfields";
import Context = require("ojs/ojcontext");

jest.mock("wrc/display/dialog", () => ({
  Dialog: ({ children }: { children: any }) => <div data-testid="mock-dialog">{children}</div>,
}));

jest.mock("wrc/shared/model/transport", () => ({
  getDataComponentText: jest.fn(),
}));

const buildFilenameModel = () => {
  const fieldDescription: Property = {
    array: false,
    type: "filename",
    name: "Filename",
    label: "Filename",
    helpLabel: "",
    helpSummaryHTML: "",
    detailedHelpHTML: "",
    externalHelp: {
      title: "",
      label: "",
      introLabel: "",
      href: "",
    },
  };

  const model = new FormContentModel(
    {
      data: {
        Filename: { value: "/tmp/example.properties" },
      },
    } as unknown as RDJ,
    {
      sliceForm: {
        properties: [fieldDescription],
      },
    } as unknown as PDJ,
  );

  return { fieldDescription, model };
};

const mockedGetDataComponentText = jest.requireMock("wrc/shared/model/transport")
  .getDataComponentText as jest.Mock;

describe("Form Fields", () => {
  afterEach(() => {
    mockedGetDataComponentText.mockReset();
  });

  describe("Properties list", () => {
    // This is mostly a smoke test until JET delivers Test Adapters suitable for Jest,
    // until then user interaction is best left up to WebDriver
    // https://jira.oraclecorp.com/jira/browse/JET-68817
    it("should create a properties list", async () => {
      // render a property list, and click the add button to add a new property...
      const fieldDescription: Property = {
        array: false,
        type: "properties",
        name: "MyProperties",
        label: "My Properties",
        helpLabel: "",
        helpSummaryHTML: "",
        detailedHelpHTML: "",
        externalHelp: {
          title: "",
          label: "",
          introLabel: "",
          href: "",
        },
      };

      const model = new FormContentModel(
        {
          data: {
            MyPropertyList: { value: { MyProperty: "My Value" } },
          },
        } as unknown as RDJ,
        {
          sliceForm: {
            properties: [{ name: "MyPropertyList", type: "properties" }],
          },
        } as unknown as PDJ,
      );

      const { container } = render(
        <div data-oj-binding-provider="preact">
          <Form formModel={model}></Form>
        </div>,
      );

      await Context.getContext(container).getBusyContext().whenReady();

      let ojTable = container.querySelector("oj-table");

      expect(ojTable?.classList.contains("cfe-model-properties-table")).toBe(
        true,
      );
      expect(ojTable?.textContent?.includes("MyPropertyMy Value"));

      const ojAddButton = ojTable?.querySelector(
        "oj-c-button[data-testid='add']",
      );

      expect(ojAddButton).toBeDefined();

      fireEvent.click(ojAddButton!);

      await Context.getContext(container).getBusyContext().whenReady();

      (ojTable as ojTable<string, string>)?.refresh();

      await Context.getContext(container).getBusyContext().whenReady();

      ojTable = container.querySelector("oj-table");

      // Current UI renders table headers "Properties Name" / "Properties Value"
      // and the row "MyProperty" / "My Value" with a "Select Row" affordance.
      // Validate the content matches current labels rather than legacy "Delete/New-Property" text.
      const text = ojTable?.textContent || "";
      expect(text).toContain("Properties Name");
      expect(text).toContain("Properties Value");
      expect(text).toContain("MyProperty");
      expect(text).toContain("My Value");
      expect(text).toContain("Select Row");
    }, 60000);
  });

  describe("Filename fields", () => {
    const originalElectronApi = (window as any).electron_api;

    afterEach(() => {
      if (typeof originalElectronApi === "undefined") {
        delete (window as any).electron_api;
      } else {
        (window as any).electron_api = originalElectronApi;
      }
    });

    it("renders filename on the main form as a free-form text field without chooser in non-Electron", async () => {
      delete (window as any).electron_api;
      const { model } = buildFilenameModel();

      const { container } = render(
        <div data-oj-binding-provider="preact">
          <Form formModel={model}></Form>
        </div>,
      );

      await Context.getContext(container).getBusyContext().whenReady();

      const textInputs = Array.from(container.querySelectorAll("oj-input-text[data-property='Filename']"));
      expect(textInputs.length).toBeGreaterThan(0);
      expect(container.querySelector("oj-c-button[aria-label='Choose directory and filename']")).toBeNull();
    });

    it("renders filename on the main form with Electron open-file chooser", async () => {
      (window as any).electron_api = {
        getOpenFile: jest.fn(),
      };
      const { model } = buildFilenameModel();

      const { container } = render(
        <div data-oj-binding-provider="preact">
          <Form formModel={model}></Form>
        </div>,
      );

      await Context.getContext(container).getBusyContext().whenReady();

      const textInputs = Array.from(container.querySelectorAll("oj-input-text[data-property='Filename']"));
      expect(textInputs.length).toBeGreaterThan(0);
      expect(container.querySelector("span.oj-ux-ico-upload")).not.toBeNull();
    });

    it("renders filename in field settings as a free-form text field without eraser in non-Electron", async () => {
      delete (window as any).electron_api;
      const { model, fieldDescription } = buildFilenameModel();

      const { container } = render(
        <div data-oj-binding-provider="preact">
          <FieldSettingsDialog
            open={false}
            formModel={model}
            fieldDescription={fieldDescription}
            onClose={() => undefined}
            onApply={() => undefined}
          />
        </div>,
      );

      const textInputs = Array.from(container.querySelectorAll("oj-input-text[data-property='Filename']"));
      expect(textInputs.length).toBeGreaterThan(0);
      expect(container.querySelector("span.oj-ux-ico-eraser")).toBeNull();
      expect(container.querySelector("span.oj-ux-ico-upload")).toBeNull();
    });

    it("renders filename in field settings with Electron open-file chooser and no eraser", async () => {
      (window as any).electron_api = {
        getOpenFile: jest.fn(),
      };
      const { model, fieldDescription } = buildFilenameModel();

      const { container } = render(
        <div data-oj-binding-provider="preact">
          <FieldSettingsDialog
            open={false}
            formModel={model}
            fieldDescription={fieldDescription}
            onClose={() => undefined}
            onApply={() => undefined}
          />
        </div>,
      );

      const textInputs = Array.from(container.querySelectorAll("oj-input-text[data-property='Filename']"));
      expect(textInputs.length).toBeGreaterThan(0);
      expect(container.querySelector("span.oj-ux-ico-eraser")).toBeNull();
      expect(container.querySelector("span.oj-ux-ico-upload")).not.toBeNull();
    });

    it("does not overwrite new filename when Electron save-as is canceled", async () => {
      const getSaveAs = jest.fn().mockResolvedValue({ succeeded: false });
      (window as any).electron_api = { getSaveAs };

      const fieldDescription: Property = {
        array: false,
        type: "newFilename",
        name: "NewFilename",
        label: "New Filename",
        helpLabel: "",
        helpSummaryHTML: "",
        detailedHelpHTML: "",
        externalHelp: {
          title: "",
          label: "",
          introLabel: "",
          href: "",
        },
      };

      const model = new FormContentModel(
        {
          data: {
            NewFilename: { value: "/tmp/original.yaml" },
          },
        } as unknown as RDJ,
        {
          sliceForm: {
            properties: [fieldDescription],
          },
        } as unknown as PDJ,
      );

      const setModel = jest.fn();
      const valueChangedHandler = jest.fn();

      const { container } = render(
        <div data-oj-binding-provider="preact">
          {getFileSelectorForNewFile(fieldDescription, model, valueChangedHandler, setModel)}
        </div>,
      );

      const chooserButton = container.querySelector("oj-c-button[aria-label='Choose directory']");
      expect(chooserButton).not.toBeNull();

      fireEvent(chooserButton!, new CustomEvent("ojAction"));
      await Promise.resolve();
      await Promise.resolve();

      expect(getSaveAs).toHaveBeenCalled();
      expect(model.getProperty("NewFilename")).toBe("/tmp/original.yaml");
      expect(setModel).not.toHaveBeenCalled();
    });
  });

  describe("Indirect fields", () => {
    const buildIndirectModel = () => {
      const fieldDescription: Property = {
        array: false,
        name: "IndirectField",
        label: "Indirect Field",
        type: "multiLineString",
        width: "xxl",
        readOnly: true,
        helpLabel: "",
        helpSummaryHTML: "",
        detailedHelpHTML: "",
        externalHelp: {
          title: "",
          label: "",
          introLabel: "",
          href: "",
        },
      };

      const model = new FormContentModel(
        {
          data: {
            IndirectField: {
              value: "/api/runtime/secrets/1",
              indirect: true,
            },
          },
        } as unknown as RDJ,
        {
          sliceForm: {
            properties: [fieldDescription],
          },
        } as unknown as PDJ,
      );

      return { fieldDescription, model };
    };

    it("renders the indirect field UI for multiline indirect fields", async () => {
      mockedGetDataComponentText.mockResolvedValue("resolved secret value");
      const { model } = buildIndirectModel();

      const { container } = render(
        <div data-oj-binding-provider="preact">
          <Form formModel={model}></Form>
        </div>,
      );

      await waitFor(() =>
        expect(mockedGetDataComponentText).toHaveBeenCalledWith("/api/runtime/secrets/1")
      );

      const indirectField = container.querySelector(".wrc-indirect-field-container");
      expect(indirectField).not.toBeNull();

      const copyButton = container.querySelector(".wrc-indirect-field-copy-btn");
      expect(copyButton).not.toBeNull();

      const plainInput = container.querySelector("oj-c-input-text[data-property='IndirectField']");
      expect(plainInput).toBeNull();
    });

    it("fetches indirect data from the RDJ source URL instead of pending edits", async () => {
      mockedGetDataComponentText.mockResolvedValue("resolved secret value");
      const { model } = buildIndirectModel();

      model.setProperty("IndirectField", "@@PROP:KEY@@");

      render(
        <div data-oj-binding-provider="preact">
          <Form formModel={model}></Form>
        </div>,
      );

      await waitFor(() =>
        expect(mockedGetDataComponentText).toHaveBeenCalledWith("/api/runtime/secrets/1")
      );

      expect(mockedGetDataComponentText).not.toHaveBeenCalledWith("@@PROP:KEY@@");
    });

    it("renders indirect fields as read-only viewers in the field settings dialog", async () => {
      mockedGetDataComponentText.mockResolvedValue("resolved secret value");
      const { model, fieldDescription } = buildIndirectModel();

      const { container } = render(
        <div data-oj-binding-provider="preact">
          <FieldSettingsDialog
            open={false}
            formModel={model}
            fieldDescription={fieldDescription}
            onClose={() => undefined}
            onApply={() => undefined}
          />
        </div>,
      );

      await waitFor(() =>
        expect(mockedGetDataComponentText).toHaveBeenCalledWith("/api/runtime/secrets/1")
      );

      expect(container.querySelector(".wrc-indirect-field-container")).not.toBeNull();
      expect(container.querySelector(".wrc-indirect-field-copy-btn")).not.toBeNull();
      expect(container.querySelector("oj-c-text-area.cfe-form-input-textarea")).toBeNull();
      expect(container.querySelector("oj-input-text[data-property='IndirectField']")).toBeNull();
    });
  });
});
