var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "@testing-library/preact", "wrc/shared/model/formcontentmodel", "../form", "ojs/ojcontext"], function (require, exports, jsx_runtime_1, preact_1, formcontentmodel_1, form_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("Form Fields", () => {
        describe("Properties list", () => {
            it("should create a properties list", () => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const fieldDescription = {
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
                const model = new formcontentmodel_1.FormContentModel({
                    data: {
                        MyPropertyList: { value: { MyProperty: "My Value" } },
                    },
                }, {
                    sliceForm: {
                        properties: [{ name: "MyPropertyList", type: "properties" }],
                    },
                });
                const { container } = (0, preact_1.render)((0, jsx_runtime_1.jsx)("div", { "data-oj-binding-provider": "preact", children: (0, jsx_runtime_1.jsx)(form_1.default, { formModel: model }) }));
                yield Context.getContext(container).getBusyContext().whenReady();
                let ojTable = container.querySelector("oj-table");
                expect(ojTable === null || ojTable === void 0 ? void 0 : ojTable.classList.contains("cfe-model-properties-table")).toBe(true);
                expect((_a = ojTable === null || ojTable === void 0 ? void 0 : ojTable.textContent) === null || _a === void 0 ? void 0 : _a.includes("MyPropertyMy Value"));
                const ojAddButton = ojTable === null || ojTable === void 0 ? void 0 : ojTable.querySelector("oj-c-button[data-testid='add']");
                expect(ojAddButton).toBeDefined();
                preact_1.fireEvent.click(ojAddButton);
                yield Context.getContext(container).getBusyContext().whenReady();
                ojTable === null || ojTable === void 0 ? void 0 : ojTable.refresh();
                yield Context.getContext(container).getBusyContext().whenReady();
                ojTable = container.querySelector("oj-table");
                const text = (ojTable === null || ojTable === void 0 ? void 0 : ojTable.textContent) || "";
                expect(text).toContain("Properties Name");
                expect(text).toContain("Properties Value");
                expect(text).toContain("MyProperty");
                expect(text).toContain("My Value");
                expect(text).toContain("Select Row");
            }), 60000);
        });
    });
});
//# sourceMappingURL=formfields.spec.js.map