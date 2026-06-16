/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { render, screen } from "@testing-library/preact";
import { HelpTable, TableDef } from "../shared/help-table";

describe("HelpTable", () => {
  it("should preserve href attributes for related and external help links", () => {
    const tableDefinition: TableDef = {
      columns: [
        { header: "Name" },
        { header: "Description" },
      ],
      rows: [
        {
          helpLabel: "Listen Port",
          detailedHelpHTML: "Controls the port.",
          externalHelp: {
            title: "Oracle Docs",
            label: "See Oracle docs",
            introLabel: "More information:",
            href: "https://example.invalid/external-help",
          },
        },
      ],
      helpTopics: [
        {
          label: "Server templates",
          href: "https://example.invalid/related-topic",
        },
      ],
    };

    render(<HelpTable tableDefinition={tableDefinition} />);

    const relatedTopicLink = screen.getByRole("link", { name: "Server templates" });
    const externalHelpLink = screen.getByRole("link", { name: "See Oracle docs" });

    expect(relatedTopicLink.getAttribute("href")).toBe("https://example.invalid/related-topic");
    expect(relatedTopicLink.getAttribute("target")).toBe("_blank");
    expect(relatedTopicLink.getAttribute("rel")).toBe("noopener noreferrer");
    expect(externalHelpLink.getAttribute("href")).toBe("https://example.invalid/external-help");
    expect(externalHelpLink.getAttribute("target")).toBe("_blank");
    expect(externalHelpLink.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("should render help labels as text when href is empty", () => {
    const tableDefinition: TableDef = {
      columns: [
        { header: "Name" },
        { header: "Description" },
      ],
      rows: [
        {
          helpLabel: "Listen Port",
          detailedHelpHTML: "Controls the port.",
          externalHelp: {
            title: "Oracle Docs",
            label: "No external link",
            introLabel: "More information:",
            href: "",
          },
        },
      ],
      helpTopics: [
        {
          label: "No related link",
          href: "",
        },
      ],
    };

    render(<HelpTable tableDefinition={tableDefinition} />);

    expect(screen.queryByRole("link", { name: "No related link" })).toBeNull();
    expect(screen.queryByRole("link", { name: "No external link" })).toBeNull();
  });
});
