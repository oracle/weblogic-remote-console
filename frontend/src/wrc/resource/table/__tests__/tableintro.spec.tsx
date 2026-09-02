/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { render } from "@testing-library/preact";
import { TableIntro } from "../tableintro";

describe("TableIntro", () => {
  it("includes the page description in the keyboard focus order", () => {
    const { container } = render(
      <TableIntro
        tableContent={{ getIntroductionHTML: () => "<p>Server description</p>" } as any}
      />,
    );

    const intro = container.querySelector("#intro");

    expect(intro?.getAttribute("tabindex")).toBe("0");
    expect(intro?.textContent).toContain("Server description");
  });
});
