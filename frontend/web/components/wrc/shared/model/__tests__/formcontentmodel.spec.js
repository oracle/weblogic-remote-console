var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "wrc/shared/model/formcontentmodel"], function (require, exports, formcontentmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("FormContentModel", () => {
        let rdj;
        let pdj;
        let formContentModel;
        describe("accessor tests", () => {
            describe("test boolean operations", () => {
                beforeEach(() => {
                    rdj = {
                        navigation: "nav",
                        self: { resourceData: "self" },
                        breadCrumbs: [],
                        links: [],
                        changeManager: {},
                        createForm: { resourceData: "createForm" },
                        pageDescription: "pageDescription",
                        data: { aboolean: { set: false, value: true } },
                    };
                    pdj = {
                        introductionHTML: "intro",
                        helpPageTitle: "helpPageTitle",
                        helpTopics: [],
                        sliceForm: {
                            properties: [
                                {
                                    name: "aboolean",
                                    label: "A Boolean Property",
                                    type: "boolean",
                                    array: false,
                                    helpLabel: "",
                                    helpSummaryHTML: "",
                                    detailedHelpHTML: "",
                                    externalHelp: {
                                        title: "",
                                        label: "",
                                        introLabel: "",
                                        href: "",
                                    },
                                },
                            ],
                        },
                    };
                    formContentModel = new formcontentmodel_1.FormContentModel(rdj, pdj);
                });
                it("should get value from rdj", () => {
                    expect(formContentModel.getProperty("aboolean")).toBe(true);
                });
                it("should replace value in rdj", () => {
                    formContentModel.setProperty("aboolean", false);
                    expect(formContentModel.getProperty("aboolean")).toBe(false);
                });
                it("should replace with a wdt token", () => {
                    formContentModel.setPropertyAsTokenValue("aboolean", "@@MY:TOKEN@@");
                    expect(formContentModel.getProperty("aboolean")).toEqual("@@MY:TOKEN@@");
                });
                it("should replace wdt token with a boolean", () => {
                    formContentModel.setPropertyAsTokenValue("aboolean", "@@MY:TOKEN@@");
                    formContentModel.setProperty("aboolean", false);
                    expect(formContentModel.getProperty("aboolean")).toEqual(false);
                });
                it("should replace boolean with wdt token", () => {
                    formContentModel.setPropertyAsTokenValue("aboolean", "@@MY:TOKEN@@");
                    formContentModel.setProperty("aboolean", false);
                    formContentModel.setPropertyAsTokenValue("aboolean", "@@MY:TOKEN2@@");
                    expect(formContentModel.getProperty("aboolean")).toEqual("@@MY:TOKEN2@@");
                });
            });
            describe("test string operations", () => {
                beforeEach(() => {
                    rdj = {
                        navigation: "nav",
                        self: { resourceData: "self" },
                        breadCrumbs: [],
                        links: [],
                        changeManager: {},
                        createForm: { resourceData: "createForm" },
                        pageDescription: "pageDescription",
                        data: { astring: { set: false, value: "hello" } },
                    };
                    pdj = {
                        introductionHTML: "intro",
                        helpPageTitle: "helpPageTitle",
                        helpTopics: [],
                        sliceForm: {
                            properties: [
                                {
                                    name: "astring",
                                    label: "A String Property",
                                    array: false,
                                    helpLabel: "",
                                    helpSummaryHTML: "",
                                    detailedHelpHTML: "",
                                    externalHelp: {
                                        title: "",
                                        label: "",
                                        introLabel: "",
                                        href: "",
                                    },
                                },
                            ],
                        },
                    };
                    formContentModel = new formcontentmodel_1.FormContentModel(rdj, pdj);
                });
                it("should get value from rdj", () => {
                    expect(formContentModel.getProperty("astring")).toBe("hello");
                });
                it("should replace value in rdj", () => {
                    formContentModel.setProperty("astring", "goodbye");
                    expect(formContentModel.getProperty("astring")).toBe("goodbye");
                });
                it("should replace with a wdt token", () => {
                    formContentModel.setPropertyAsTokenValue("astring", "@@MY:TOKEN@@");
                    expect(formContentModel.getProperty("astring")).toEqual("@@MY:TOKEN@@");
                });
                it("should replace wdt token with a string", () => {
                    formContentModel.setPropertyAsTokenValue("astring", "@@MY:TOKEN@@");
                    formContentModel.setProperty("astring", "test");
                    expect(formContentModel.getProperty("astring")).toEqual("test");
                });
                it("should replace string with wdt token", () => {
                    formContentModel.setPropertyAsTokenValue("astring", "@@MY:TOKEN@@");
                    formContentModel.setProperty("astring", "foo");
                    formContentModel.setPropertyAsTokenValue("astring", "@@MY:TOKEN2@@");
                    expect(formContentModel.getProperty("astring")).toEqual("@@MY:TOKEN2@@");
                });
            });
            describe("test int operations", () => {
                beforeEach(() => {
                    rdj = {
                        navigation: "nav",
                        self: { resourceData: "self" },
                        breadCrumbs: [],
                        links: [],
                        changeManager: {},
                        createForm: { resourceData: "createForm" },
                        pageDescription: "pageDescription",
                        data: { anint: { set: false, value: 123 } },
                    };
                    pdj = {
                        introductionHTML: "intro",
                        helpPageTitle: "helpPageTitle",
                        helpTopics: [],
                        sliceForm: {
                            properties: [
                                {
                                    name: "anint",
                                    label: "A numeric Property",
                                    type: "int",
                                    array: false,
                                    helpLabel: "",
                                    helpSummaryHTML: "",
                                    detailedHelpHTML: "",
                                    externalHelp: {
                                        title: "",
                                        label: "",
                                        introLabel: "",
                                        href: "",
                                    },
                                },
                            ],
                        },
                    };
                    formContentModel = new formcontentmodel_1.FormContentModel(rdj, pdj);
                });
                it("should get value from rdj", () => {
                    expect(formContentModel.getProperty("anint")).toBe(123);
                });
                it("should replace value in rdj", () => {
                    formContentModel.setProperty("anint", 124);
                    expect(formContentModel.getProperty("anint")).toBe(124);
                });
                it("should replace with a wdt token", () => {
                    formContentModel.setPropertyAsTokenValue("anint", "@@MY:TOKEN@@");
                    expect(formContentModel.getProperty("anint")).toEqual("@@MY:TOKEN@@");
                });
                it("should replace wdt token with a number", () => {
                    formContentModel.setPropertyAsTokenValue("anint", "@@MY:TOKEN@@");
                    formContentModel.setProperty("anint", 125);
                    expect(formContentModel.getProperty("anint")).toEqual(125);
                });
                it("should replace a number with a wdt token", () => {
                    formContentModel.setPropertyAsTokenValue("anint", "@@MY:TOKEN@@");
                    formContentModel.setProperty("anint", 333);
                    formContentModel.setPropertyAsTokenValue("anint", "@@MY:TOKEN2@@");
                    expect(formContentModel.getProperty("anint")).toEqual("@@MY:TOKEN2@@");
                });
            });
            describe("test reference-dynamic-enum operations", () => {
                beforeEach(() => {
                    rdj = {
                        navigation: "nav",
                        self: { resourceData: "self" },
                        breadCrumbs: [],
                        links: [],
                        changeManager: {},
                        createForm: { resourceData: "createForm" },
                        pageDescription: "pageDescription",
                        data: {
                            aRefEnum: {
                                set: true,
                                value: {
                                    label: "opt1",
                                    resourceData: "/api/something/opt1",
                                },
                                options: [
                                    {
                                        label: "None",
                                        value: null,
                                    },
                                    {
                                        label: "opt1",
                                        value: {
                                            label: "opt1",
                                            resourceData: "/api/something/opt1",
                                        },
                                    },
                                    {
                                        label: "opt2",
                                        value: {
                                            label: "opt2",
                                            resourceData: "/api/something/opt2",
                                        },
                                    },
                                ],
                                optionsSources: [
                                    {
                                        label: "Something",
                                        resourceData: "/api/something",
                                    },
                                ],
                            },
                        },
                    };
                    pdj = {
                        introductionHTML: "intro",
                        helpPageTitle: "helpPageTitle",
                        helpTopics: [],
                        sliceForm: {
                            properties: [
                                {
                                    name: "aRefEnum",
                                    label: "aRefEnum",
                                    helpLabel: "",
                                    type: "reference-dynamic-enum",
                                    array: false,
                                    helpSummaryHTML: "",
                                    detailedHelpHTML: "",
                                    externalHelp: {
                                        title: "",
                                        label: "",
                                        introLabel: "",
                                        href: "",
                                    },
                                    defaultValue: null,
                                    restartNeeded: true,
                                },
                            ],
                        },
                    };
                    formContentModel = new formcontentmodel_1.FormContentModel(rdj, pdj);
                });
                it("should get value from rdj", () => {
                    expect(formContentModel.getProperty("aRefEnum")).toEqual(expect.objectContaining({
                        label: "opt1",
                        resourceData: "/api/something/opt1",
                    }));
                });
                it("should replace value in rdj", () => {
                    formContentModel.setProperty("aRefEnum", {
                        label: "opt2",
                        resourceData: "/api/something/opt2",
                    });
                    expect(formContentModel.getProperty("aRefEnum")).toEqual(expect.objectContaining({
                        label: "opt2",
                        resourceData: "/api/something/opt2",
                    }));
                });
                it("should replace with a wdt token", () => {
                    formContentModel.setPropertyAsTokenValue("aRefEnum", "@@MY:TOKEN@@");
                    expect(formContentModel.getProperty("aRefEnum")).toEqual("@@MY:TOKEN@@");
                });
                it("should replace wdt token with a value", () => {
                    formContentModel.setPropertyAsTokenValue("aRefEnum", "@@MY:TOKEN@@");
                    formContentModel.setProperty("aRefEnum", {
                        label: "opt2",
                        resourceData: "/api/something/opt2",
                    });
                    expect(formContentModel.getProperty("aRefEnum")).toEqual(expect.objectContaining({
                        label: "opt2",
                        resourceData: "/api/something/opt2",
                    }));
                });
                it("should replace a number with a wdt token", () => {
                    formContentModel.setPropertyAsTokenValue("aRefEnum", "@@MY:TOKEN@@");
                    formContentModel.setProperty("aRefEnum", {
                        label: "opt2",
                        resourceData: "/api/something/opt2",
                    });
                    formContentModel.setPropertyAsTokenValue("aRefEnum", "@@MY:TOKEN2@@");
                    expect(formContentModel.getProperty("aRefEnum")).toEqual("@@MY:TOKEN2@@");
                });
                it("should set an unresolved reference", () => {
                    formContentModel.setPropertyAsUnresolvedReference("aRefEnum", "unresolved ref");
                    expect(formContentModel.getProperty("aRefEnum")).toEqual(expect.objectContaining({
                        label: "unresolved ref",
                        unresolvedReference: "unresolved ref",
                    }));
                });
            });
        });
        describe("test update function", () => {
            beforeEach(() => {
                rdj = {
                    navigation: "nav",
                    self: { resourceData: "self" },
                    breadCrumbs: [],
                    links: [],
                    changeManager: {},
                    createForm: { resourceData: "createForm" },
                    pageDescription: "pageDescription",
                    data: {
                        aRefEnum: {
                            set: true,
                            value: {
                                label: "opt1",
                                resourceData: "/api/something/opt1",
                            },
                            options: [
                                {
                                    label: "None",
                                    value: null,
                                },
                                {
                                    label: "opt1",
                                    value: {
                                        label: "opt1",
                                        resourceData: "/api/something/opt1",
                                    },
                                },
                                {
                                    label: "opt2",
                                    value: {
                                        label: "opt2",
                                        resourceData: "/api/something/opt2",
                                    },
                                },
                            ],
                            optionsSources: [
                                {
                                    label: "Something",
                                    resourceData: "/api/something",
                                },
                            ],
                        },
                    },
                };
                pdj = {
                    introductionHTML: "intro",
                    helpPageTitle: "helpPageTitle",
                    helpTopics: [],
                    sliceForm: {
                        properties: [
                            {
                                required: true,
                                name: "aboolean",
                                label: "A Boolean Property",
                                type: "boolean",
                                array: false,
                                helpLabel: "",
                                helpSummaryHTML: "",
                                detailedHelpHTML: "",
                                externalHelp: {
                                    title: "",
                                    label: "",
                                    introLabel: "",
                                    href: "",
                                },
                            },
                            {
                                name: "astring",
                                label: "A String Property",
                                array: false,
                                helpLabel: "",
                                helpSummaryHTML: "",
                                detailedHelpHTML: "",
                                externalHelp: {
                                    title: "",
                                    label: "",
                                    introLabel: "",
                                    href: "",
                                },
                            },
                            {
                                name: "anint",
                                label: "A numeric Property",
                                type: "int",
                                array: false,
                                helpLabel: "",
                                helpSummaryHTML: "",
                                detailedHelpHTML: "",
                                externalHelp: {
                                    title: "",
                                    label: "",
                                    introLabel: "",
                                    href: "",
                                },
                            },
                            {
                                name: "aRefEnum",
                                label: "aRefEnum",
                                helpLabel: "",
                                type: "reference-dynamic-enum",
                                array: false,
                                helpSummaryHTML: "",
                                detailedHelpHTML: "",
                                externalHelp: {
                                    title: "",
                                    label: "",
                                    introLabel: "",
                                    href: "",
                                },
                                defaultValue: null,
                                restartNeeded: true,
                            },
                        ],
                    },
                };
                formContentModel = new formcontentmodel_1.FormContentModel(rdj, pdj);
                formContentModel.rdjUrl = "bogus";
            });
            it("shouldn't update values with no changes", () => __awaiter(void 0, void 0, void 0, function* () {
                global.fetch = jest.fn(() => Promise.resolve({
                    json: () => Promise.resolve({}),
                }));
                yield formContentModel.update();
                expect(global.fetch).toBeCalledTimes(1);
                expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
                    body: JSON.stringify({
                        data: {},
                    }),
                    method: "POST",
                }));
            }));
            it("should update with changes", () => __awaiter(void 0, void 0, void 0, function* () {
                global.fetch = jest.fn(() => Promise.resolve({
                    json: () => Promise.resolve({}),
                }));
                formContentModel.setProperty("anint", 555);
                formContentModel.setProperty("astring", "new");
                formContentModel.setProperty("aboolean", false);
                yield formContentModel.update();
                expect(global.fetch).toBeCalledTimes(1);
                expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
                    body: JSON.stringify({
                        data: {
                            anint: { value: 555 },
                            astring: { value: "new" },
                            aboolean: { value: false },
                        },
                    }),
                    method: "POST",
                }));
            }));
            it("should update without changes that were redundant", () => __awaiter(void 0, void 0, void 0, function* () {
                global.fetch = jest.fn(() => Promise.resolve({
                    json: () => Promise.resolve({}),
                }));
                formContentModel.setProperty("aRefEnum", {
                    label: "opt1",
                    resourceData: "/api/something/opt1",
                });
                expect(formContentModel.hasChanges()).toBe(false);
                formContentModel.setProperty("aboolean", true);
                yield formContentModel.update();
                expect(global.fetch).toBeCalledTimes(1);
                expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
                    body: JSON.stringify({
                        data: {
                            aboolean: { value: true },
                        },
                    }),
                    method: "POST",
                }));
            }));
        });
    });
});
//# sourceMappingURL=formcontentmodel.spec.js.map