/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import {
  createEvent,
  fireEvent,
  render,
  screen,
} from "@testing-library/preact";
import MultiSelect, { ChangeEvent, SelectOption } from "wrc/multiselect";
import Context = require("ojs/ojcontext");

describe("Multiselect component", () => {
  let available: SelectOption[];
  let chosen: SelectOption[];

  const changeHandler = (event: ChangeEvent) => {
    available = event.available;
    chosen = event.chosen;
  };

  beforeEach(() => {
    available = [
      {
        label: "apple",
        key: "A",
      },
      {
        label: "orange",
        key: "O",
      },
      {
        label: "banana",
        key: "B",
      },
    ];
    chosen = [
      {
        label: "grape",
        key: "G",
      },
    ];
  });

  const renderContent = () =>
    render(
      <div data-oj-binding-provider="preact">
        <MultiSelect
          available={available}
          chosen={chosen}
          changeHandler={changeHandler}
        />
      </div>,
    );

  test("Multiselect Renders with options", async () => {
    const content = renderContent();

    await Context.getContext(content.container).getBusyContext().whenReady();

    let r = screen.getByTestId("available");

    const getTextContextFromUnderlyingList = (htmlElement: HTMLElement) => {
      const textArray: (string | null)[] = [];

      htmlElement.querySelectorAll("ul > li").forEach((i) => {
        textArray.push((i as HTMLLIElement).textContent);
      });

      return textArray;
    };

    const renderedAvailable = getTextContextFromUnderlyingList(r);

    r = screen.getByTestId("chosen");

    const renderedChosen = getTextContextFromUnderlyingList(r);

    expect(renderedAvailable).toEqual(["apple", "orange", "banana"]);
    expect(renderedChosen).toEqual(["grape"]);
  });

  // helper func to check items in a checkboxset
  const selectAnItem = (element: HTMLElement, keys: string[]) => {
    fireEvent(
      element,
      createEvent(
        "valueChanged",
        element,
        {
          detail: {
            updatedFrom: "internal",
            value: keys,
          },
        },
        { EventType: "CustomEvent" },
      ),
    );
  };

  // helper func to click an oj-button
  const clickAButton = (element: HTMLElement) => {
    expect((element as HTMLButtonElement).disabled).toBe(false);

    fireEvent(
      element,
      createEvent(
        "ojAction",
        element,
        {
          target: element,
        },
        { EventType: "CustomEvent" },
      ),
    );
  };

  describe("when an available item is selected", () => {
    test("and Add Button is clicked, should move to chosen list", async () => {
      const content = renderContent();

      await Context.getContext(content.container).getBusyContext().whenReady();

      const buttons = screen.getAllByTestId(
        "add button",
      ) as HTMLButtonElement[];

      const availableCheckboxSet = screen.getByTestId("available");

      // button should be disabled until an item is checked
      expect(buttons[0].disabled).toEqual(true);

      // check the "Apple" item from 'available' list
      selectAnItem(availableCheckboxSet, ["A"]);

      clickAButton(buttons[0]);

      expect(available).toEqual([
        {
          label: "orange",
          key: "O",
        },
        {
          label: "banana",
          key: "B",
        },
      ]);

      expect(chosen).toEqual([
        {
          label: "grape",
          key: "G",
        },
        {
          label: "apple",
          key: "A",
        },
      ]);
    });
  });

  describe("when no available item is selected", () => {
    test("and Add All Button is clicked, all should be moved to chosen list", async () => {
      const content = renderContent();

      await Context.getContext(content.container).getBusyContext().whenReady();

      const buttons = screen.getAllByTestId("add all button");

      clickAButton(buttons[0]);

      expect(available).toEqual([]);

      expect(chosen).toEqual([
        {
          label: "grape",
          key: "G",
        },
        {
          label: "apple",
          key: "A",
        },
        {
          label: "orange",
          key: "O",
        },
        {
          label: "banana",
          key: "B",
        },
      ]);
    });
  });

  describe("when a chosen item is selected", () => {
    test("and Remove Button is clicked, should move to available list", async () => {
      const content = renderContent();

      await Context.getContext(content.container).getBusyContext().whenReady();
      const buttons = screen.getAllByTestId(
        "remove button",
      ) as HTMLButtonElement[];

      const chosenCheckboxSet = screen.getByTestId("chosen");

      // button should be disabled until an item is checked
      expect(buttons[0].disabled).toEqual(true);

      // check the "Grape" item from 'chosen' list
      selectAnItem(chosenCheckboxSet, ["G"]);

      clickAButton(buttons[0]);

      expect(available).toEqual([
        {
          label: "apple",
          key: "A",
        },
        {
          label: "orange",
          key: "O",
        },
        {
          label: "banana",
          key: "B",
        },
        {
          label: "grape",
          key: "G",
        },
      ]);

      expect(chosen).toEqual([]);
    });
  });

  describe("when no chosen item is selected", () => {
    test("Remove All Button, all should be moved to available list", async () => {
      const content = renderContent();

      await Context.getContext(content.container).getBusyContext().whenReady();

      const buttons = screen.getAllByTestId("remove all button");

      clickAButton(buttons[0]);

      expect(available).toEqual([
        {
          label: "apple",
          key: "A",
        },
        {
          label: "orange",
          key: "O",
        },
        {
          label: "banana",
          key: "B",
        },
        {
          label: "grape",
          key: "G",
        },
      ]);

      expect(chosen).toEqual([]);
    });
  });
});
