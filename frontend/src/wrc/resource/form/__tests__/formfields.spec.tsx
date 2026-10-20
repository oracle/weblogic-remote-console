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

const createStringFieldDescription = (name: string, label: string): Property => ({
  array: false,
  name,
  label,
  type: "String",
  helpLabel: "",
  helpSummaryHTML: "",
  detailedHelpHTML: "",
  externalHelp: { title: "", label: "", introLabel: "", href: "" },
});

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

      // The editable table consumes Enter for row navigation unless the Add
      // control handles it before the event reaches the table.
      expect(fireEvent.keyDown(ojAddButton!, { key: "Enter", cancelable: true })).toBe(false);

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

    it("deletes a properties row with Enter", async () => {
      const fieldDescription = {
        array: false,
        type: "properties",
        name: "JavaMailProperties",
        label: "Java Mail Properties",
      } as Property;
      const model = new FormContentModel(
        {
          data: {
            JavaMailProperties: { value: { "mail.smtp.port": "465", "mail.imap.port": "993" } },
          },
        } as unknown as RDJ,
        { sliceForm: { properties: [fieldDescription] } } as unknown as PDJ,
      );

      const { container } = render(
        <div data-oj-binding-provider="preact">
          <Form formModel={model}></Form>
        </div>,
      );
      await Context.getContext(container).getBusyContext().whenReady();

      const deleteButton = container.querySelector("oj-c-button[data-testid='delete']");
      expect(deleteButton).not.toBeNull();

      fireEvent.keyDown(deleteButton!, { key: "Enter" });
      await Context.getContext(container).getBusyContext().whenReady();

      expect(model.getProperty("JavaMailProperties")).toEqual({ "mail.imap.port": "993" });
    }, 60000);

    it("deletes an array row with Enter", async () => {
      const fieldDescription = {
        array: true,
        type: "string",
        name: "Recipients",
        label: "Recipients",
      } as Property;
      const model = new FormContentModel(
        {
          data: {
            Recipients: { value: [{ value: "first@example.com" }, { value: "second@example.com" }] },
          },
        } as unknown as RDJ,
        { sliceForm: { properties: [fieldDescription] } } as unknown as PDJ,
      );

      const { container } = render(
        <div data-oj-binding-provider="preact">
          <Form formModel={model}></Form>
        </div>,
      );
      await Context.getContext(container).getBusyContext().whenReady();

      const deleteButton = container.querySelector("oj-c-button[data-testid='delete']");
      expect(deleteButton).not.toBeNull();

      fireEvent.keyDown(deleteButton!, { key: "Enter" });
      await Context.getContext(container).getBusyContext().whenReady();

      expect(model.getProperty("Recipients")).toEqual(["second@example.com"]);
    }, 60000);
  });

  it("includes the owning form model in Field Settings launcher events", async () => {
    const fieldDescription: Property = {
      array: false,
      name: "Name",
      label: "Name",
      type: "String",
      helpLabel: "",
      helpSummaryHTML: "",
      detailedHelpHTML: "",
      externalHelp: { title: "", label: "", introLabel: "", href: "" },
    };
    const model = new FormContentModel(
      { data: { Name: { value: "example" } } } as unknown as RDJ,
      { sliceForm: { properties: [fieldDescription] } } as unknown as PDJ,
    );
    const listener = jest.fn();
    document.addEventListener("open-field-settings", listener);

    try {
      const { container } = render(
        <div data-oj-binding-provider="preact">
          <Form formModel={model} />
        </div>,
      );
      await Context.getContext(container).getBusyContext().whenReady();

      const launcher = container.querySelector("span.oj-ux-ico-target")?.closest("oj-c-button");
      expect(launcher).not.toBeNull();
      fireEvent(launcher!, new CustomEvent("ojAction"));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].detail).toEqual({ fieldDescription, formModel: model });
    } finally {
      document.removeEventListener("open-field-settings", listener);
    }
  });

  it("renders a defaulted field when a page property is missing from the RDJ", async () => {
    const presentField = createStringFieldDescription(
      "PresentProperty",
      "Present Property",
    );
    const missingField = createStringFieldDescription(
      "MissingProperty",
      "Missing Property",
    );
    const model = new FormContentModel(
      {
        data: {
          PresentProperty: { value: "present value" },
        },
      } as unknown as RDJ,
      {
        sliceForm: {
          properties: [presentField, missingField],
        },
      } as unknown as PDJ,
    );

    const { container } = render(
      <div data-oj-binding-provider="preact">
        <Form formModel={model} />
      </div>,
    );
    await Context.getContext(container).getBusyContext().whenReady();

    expect(
      container.querySelector(
        "oj-c-input-text[data-property='PresentProperty']",
      ),
    ).not.toBeNull();
    expect(container.textContent).toContain("Missing Property");

    const defaultedFields = container.querySelectorAll(
      "oj-input-text.wrc-defaulted-field",
    );
    expect(defaultedFields).toHaveLength(1);
    expect((defaultedFields[0] as any).disabled).toBe(true);
    expect((defaultedFields[0] as any).readonly).toBe(true);
  });

  it("treats a field missing from the RDJ as read-only in Field Settings", async () => {
    const fieldDescription = createStringFieldDescription(
      "MissingProperty",
      "Missing Property",
    );
    const model = new FormContentModel(
      { data: {} } as unknown as RDJ,
      {
        sliceForm: {
          properties: [fieldDescription],
        },
      } as unknown as PDJ,
    );
    const onApply = jest.fn();

    const { container } = render(
      <div data-oj-binding-provider="preact">
        <FieldSettingsDialog
          open={false}
          formModel={model}
          fieldDescription={fieldDescription}
          onClose={() => undefined}
          onApply={onApply}
        />
      </div>,
    );

    expect(model.isPropertyMissingFromRDJ(fieldDescription.name)).toBe(true);

    const input = container.querySelector(
      "oj-input-text[data-property='MissingProperty']",
    );
    expect(input).not.toBeNull();
    expect((input as any).readonly).toBe(true);

    Object.defineProperty(container.querySelector("#fieldSettingsDialog"), "close", {
      configurable: true,
      value: jest.fn(),
    });

    fireEvent(
      input!,
      new CustomEvent("rawValueChanged", {
        detail: { value: "unsupported value" },
      }),
    );
    fireEvent(
      container.querySelector("#dlgOkBtn")!,
      new CustomEvent("ojAction"),
    );

    expect(model.hasChanges()).toBe(false);
    expect(onApply).not.toHaveBeenCalled();
  });

  it("keeps a supported field restored to default editable in Field Settings", async () => {
    const fieldDescription = createStringFieldDescription(
      "SupportedProperty",
      "Supported Property",
    );
    const model = new FormContentModel(
      {
        data: {
          SupportedProperty: { set: true, value: "configured value" },
        },
      } as unknown as RDJ,
      {
        sliceForm: {
          properties: [fieldDescription],
        },
      } as unknown as PDJ,
    );

    model.setProperty(fieldDescription.name);

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

    expect(model.isPropertyDefaulted(fieldDescription.name)).toBe(true);
    expect(model.isPropertyMissingFromRDJ(fieldDescription.name)).toBe(false);

    const input = container.querySelector(
      "oj-input-text[data-property='SupportedProperty']",
    );
    expect(input).not.toBeNull();
    expect((input as any).readonly).toBe(false);
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
