/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { render } from "@testing-library/preact";

import { WeightedSort } from "../weighted-sort";

describe("Weighted Sorter", () => {
  const ACustomComponent = () => <p>3</p>;

  describe("when the nodes are in sequence", () => {
    it("nodes should be unmodified", async () => {
      const content = render(
        <div data-oj-binding-provider="preact">
          <WeightedSort>
            <p data-weight="0">1</p>
            <p data-weight="1">2</p>
            <ACustomComponent data-weight="2" />
            <p data-weight="3">4</p>
          </WeightedSort>
        </div>,
      );

      expect(content.baseElement.textContent).toBe("1234");
    });
  });

  describe("when the nodes are out of sequence", () => {
    it("nodes should be reordered", async () => {
      const content = render(
        <div data-oj-binding-provider="preact">
          <WeightedSort>
            <p data-weight="3">1</p>
            <p data-weight="2">2</p>
            <ACustomComponent data-weight="1" />
            <p data-weight="0">4</p>
          </WeightedSort>
        </div>,
      );

      expect(content.baseElement.textContent).toBe("4321");
    });
  });
});
