/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { fireEvent, render } from "@testing-library/preact";
import { ojTable } from "ojs/ojtable";
import { FormContentModel } from "wrc/shared/model/formcontentmodel";
import { PDJ, Property } from "wrc/shared/typedefs/pdj";
import { RDJ } from "wrc/shared/typedefs/rdj";
import Form from "../form";
import Context = require("ojs/ojcontext");

describe("Form Fields", () => {
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
});
