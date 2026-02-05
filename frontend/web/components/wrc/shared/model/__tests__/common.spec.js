var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("Model", () => {
        let model;
        let rdj;
        let pdj;
        beforeEach(() => {
            rdj = {
                navigation: "nav",
                self: { resourceData: "self" },
                breadCrumbs: [],
                links: [],
                changeManager: {},
                createForm: { resourceData: "createForm" },
                pageDescription: "pageDescription",
            };
            pdj = {
                introductionHTML: "intro",
                helpPageTitle: "helpPageTitle",
                helpTopics: [],
            };
            model = new common_1.Model(rdj, pdj);
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
                pdj.helpPageTitle = "";
                rdj.self.label = "Self Label";
                expect(model.getPageTitle()).toBe("Self Label");
            });
            it("returns undefined when neither helpPageTitle nor self.label are provided", () => {
                pdj.helpPageTitle = "";
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
                    it("should POST to the invoker specifying the action", () => __awaiter(void 0, void 0, void 0, function* () {
                        const action = {
                            name: "actionName",
                            label: "actionLabel",
                        };
                        const references = [{ resourceData: "ref1" }];
                        model.rdj.actions = {
                            actionName: { invoker: { resourceData: "/invoker" } },
                        };
                        model.rdjUrl = "http://localhost:2345/rdj";
                        global.fetch = jest.fn(() => Promise.resolve({
                            json: () => Promise.resolve({}),
                        }));
                        yield model.invokeAction(action, references);
                        expect(global.fetch).toHaveBeenCalledTimes(1);
                        expect(global.fetch).toHaveBeenCalledWith("/invoker?action=actionName", expect.objectContaining({
                            body: JSON.stringify({
                                rows: { value: [{ value: references[0] }] },
                            }),
                            method: "POST",
                        }));
                    }));
                });
                describe("without invoker", () => {
                    it("should POST to the rdj url specifying the action", () => __awaiter(void 0, void 0, void 0, function* () {
                        const action = {
                            name: "actionName",
                            label: "actionLabel",
                        };
                        const references = [{ resourceData: "ref1" }];
                        model.rdj.actions = {
                            actionName: {},
                        };
                        model.rdjUrl = "http://localhost:2345/rdj";
                        global.fetch = jest.fn(() => Promise.resolve({
                            json: () => Promise.resolve({}),
                        }));
                        yield model.invokeAction(action, references);
                        expect(global.fetch).toHaveBeenCalledTimes(1);
                        const expectedUrl = new URL(model.rdjUrl).pathname + "?action=actionName";
                        expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({
                            body: JSON.stringify({
                                rows: { value: [{ value: references[0] }] },
                            }),
                            method: "POST",
                        }));
                    }));
                });
            });
        });
        describe("ActionInput Tests", () => {
            describe("getActionFormInput", () => {
                it("should return inputForm resourceData for action", () => {
                    const action = {
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
                it("should POST to the invoker url", () => __awaiter(void 0, void 0, void 0, function* () {
                    const payload = {
                        key: { value: "value" },
                    };
                    model.rdj.invoker = { resourceData: "/invoker" };
                    model.rdjUrl = "http://localhost:2345/rdj";
                    global.fetch = jest.fn(() => Promise.resolve({
                        json: () => Promise.resolve({}),
                    }));
                    yield model.invokeActionInputAction(payload);
                    expect(global.fetch).toHaveBeenCalledTimes(1);
                    expect(global.fetch).toHaveBeenCalledWith("/invoker", expect.objectContaining({
                        body: JSON.stringify({
                            data: payload,
                        }),
                        method: "POST",
                    }));
                }));
            });
        });
    });
});
//# sourceMappingURL=common.spec.js.map