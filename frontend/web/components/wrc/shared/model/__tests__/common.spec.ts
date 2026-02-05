/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Action, PDJ } from "wrc/shared/typedefs/pdj";
import { PropertyValueHolder, RDJ, Reference } from "wrc/shared/typedefs/rdj";
import { Model } from "../common";

describe("Model", () => {
  let model: Model;
  let rdj: RDJ;
  let pdj: PDJ;

  beforeEach(() => {
    rdj = {
      navigation: "nav",
      self: { resourceData: "self" },
      breadCrumbs: [],
      links: [],
      changeManager: {} as any,
      createForm: { resourceData: "createForm" },
      pageDescription: "pageDescription",
    };

    pdj = {
      introductionHTML: "intro",
      helpPageTitle: "helpPageTitle",
      helpTopics: [],
    };

    model = new Model(rdj, pdj);
  });

  describe("constructor", () => {
    it("should initialize properties", () => {
      expect(model.rdj).toBe(rdj);
      expect(model.pdj).toBe(pdj);
    });
  });

  describe("getPageTitle", () => {
    it("returns PDJ.helpPageTitle when present", () => {
      pdj.helpPageTitle = "My Help Title";
      expect(model.getPageTitle()).toBe("My Help Title");
    });

    it("falls back to RDJ.self.label when helpPageTitle is empty", () => {
      pdj.helpPageTitle = "" as any;
      rdj.self.label = "Self Label";
      expect(model.getPageTitle()).toBe("Self Label");
    });

    it("returns undefined when neither helpPageTitle nor self.label are provided", () => {
      pdj.helpPageTitle = "" as any;
      rdj.self = { resourceData: "self" };
      expect(model.getPageTitle()).toBeUndefined();
    });
  });

  describe("Action tests", () => {
    describe("getActions", () => {
      it("should return actions from pdj.sliceForm", () => {
        pdj.sliceForm = {
          actions: [
            {
              name: "action1",
              label: "action 1",
            },
            {
              name: "action2",
              label: "action 2",
            },
          ],
        };
        expect(model.getActions()).toEqual([
          {
            name: "action1",
            label: "action 1",
          },
          {
            name: "action2",
            label: "action 2",
          },
        ]);
      });

      it("should return undefined if pdj.sliceForm is undefined", () => {
        pdj.sliceForm = undefined;
        expect(model.getActions()).toBeUndefined();
      });
    });

    describe("invokeAction", () => {
      describe("with invoker", () => {
        it("should POST to the invoker specifying the action", async () => {
          const action: Action = {
            name: "actionName",
            label: "actionLabel",
          };
          const references: Reference[] = [{ resourceData: "ref1" }];
          model.rdj.actions = {
            actionName: { invoker: { resourceData: "/invoker" } },
          };
          model.rdjUrl = "http://localhost:2345/rdj";

          global.fetch = jest.fn(() =>
            Promise.resolve({
              json: () => Promise.resolve({}),
            }),
          ) as jest.Mock;

          await model.invokeAction(action, references);

          expect(global.fetch).toHaveBeenCalledTimes(1);
          expect(global.fetch).toHaveBeenCalledWith(
            "/invoker?action=actionName",
            expect.objectContaining({
              body: JSON.stringify({
                rows: { value: [{ value: references[0] }] },
              }),
              method: "POST",
            }),
          );
        });
      });

      describe("without invoker", () => {
        it("should POST to the rdj url specifying the action", async () => {
          const action: Action = {
            name: "actionName",
            label: "actionLabel",
          };
          const references: Reference[] = [{ resourceData: "ref1" }];
          model.rdj.actions = {
            actionName: {},
          };
          model.rdjUrl = "http://localhost:2345/rdj";

          global.fetch = jest.fn(() =>
            Promise.resolve({
              json: () => Promise.resolve({}),
            }),
          ) as jest.Mock;

          await model.invokeAction(action, references);

          expect(global.fetch).toHaveBeenCalledTimes(1);

          const expectedUrl = new URL(model.rdjUrl).pathname + "?action=actionName";
          expect(global.fetch).toHaveBeenCalledWith(
            expectedUrl,
            expect.objectContaining({
              body: JSON.stringify({
                rows: { value: [{ value: references[0] }] },
              }),
              method: "POST",
            }),
          );
        });
      });
    });
  });

  describe("ActionInput Tests", () => {
    describe("getActionFormInput", () => {
      it("should return inputForm resourceData for action", () => {
        const action: Action = {
          name: "actionName",
          label: "",
        };
        model.rdj.actions = {
          actionName: { inputForm: { resourceData: "/inputForm" } },
        };
        expect(model.getActionFormInput(action)).toBe("/inputForm");
      });
    });

    describe("invokeActionInputAction", () => {
      it("should POST to the invoker url", async () => {
        const payload: Record<string, PropertyValueHolder> = {
          key: { value: "value" },
        };
        model.rdj.invoker = { resourceData: "/invoker" };
        model.rdjUrl = "http://localhost:2345/rdj";

        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({}),
          }),
        ) as jest.Mock;

        await model.invokeActionInputAction(payload);

        expect(global.fetch).toHaveBeenCalledTimes(1);

        expect(global.fetch).toHaveBeenCalledWith(
          "/invoker",
          expect.objectContaining({
            body: JSON.stringify({
              data: payload,
            }),
            method: "POST",
          }),
        );
      });
    });
  });
});
